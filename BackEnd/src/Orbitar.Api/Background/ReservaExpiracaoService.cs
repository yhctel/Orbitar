using Microsoft.EntityFrameworkCore;
using Orbitar.Domain.Enums;
using Orbitar.Infrastructure.Persistence;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Orbitar.Api.Background;

public class ReservaExpiracaoServices : BackgroundService
{
    private readonly IServiceProvider _provider;
    private readonly ILogger<ReservaExpiracaoServices> _logger;

    public ReservaExpiracaoServices(IServiceProvider provider, ILogger<ReservaExpiracaoServices> logger)
    {
        _provider = provider;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        // varredura periódica simples
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                using var escopo = _provider.CreateScope();
                var db = escopo.ServiceProvider.GetRequiredService<AppDbContext>();
                var agora = DateTime.UtcNow;

                var aExpirar = await db.Reservas
                    .Where(r => r.Status == StatusReserva.Ativa && r.DataExpiracao <= agora)
                    .Include(r => r.Produto)
                    .ToListAsync(stoppingToken);

                foreach (var r in aExpirar)
                {
                    r.Status = StatusReserva.Expirada;
                    if (r.Produto != null && r.Produto.Status == StatusProduto.Reservado)
                        r.Produto.Status = StatusProduto.Disponivel;
                }

                if (aExpirar.Count > 0)
                {
                    await db.SaveChangesAsync(stoppingToken);
                    _logger.LogInformation("Reservas expiradas: {Count}", aExpirar.Count);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao expirar reservas");
            }

            await Task.Delay(TimeSpan.FromMinutes(10), stoppingToken);
        }
    }
}