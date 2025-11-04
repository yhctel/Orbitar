using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Orbitar.Domain.Entities;
using Orbitar.Domain.Enums;
using Orbitar.Infrastructure.Persistence;
using System.Security.Claims;

namespace Orbitar.Api.Controllers;

[ApiController]
[Route("api/reservas")]
[Authorize]
public class ReservasController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly UserManager<ApplicationUser> _userManager;

    public ReservasController(AppDbContext db, UserManager<ApplicationUser> userManager)
    {
        _db = db;
        _userManager = userManager;
    }

    private string UsuarioId => User.FindFirst(ClaimTypes.NameIdentifier)?.Value!;

    [HttpGet("minhas")]
    public async Task<IActionResult> ObterMinhasReservas()
    {
        var uid = UsuarioId;
        var minhasReservas = await _db.Reservas
            .AsNoTracking()
            .Where(r => r.ReceptorId == uid)
            .Include(r => r.Produto)
                .ThenInclude(p => p!.Dono!)
            .OrderByDescending(r => r.DataReserva)
            .Select(r => new MinhaReservaResponse
            {
                Id = r.Id,
                ProdutoId = r.ProdutoId,
                ProdutoNome = r.Produto!.Nome,
                ProdutoImagemUrl = r.Produto!.ImagemUrl ?? string.Empty,
                DonoNome = r.Produto!.Dono!.NomeCompleto ?? string.Empty,
                Status = r.Status
            })
            .ToListAsync();
        return Ok(minhasReservas);
    }

    [HttpGet("nos-meus-produtos")]
    public async Task<IActionResult> ObterReservasNosMeusProdutos()
    {
        var uid = UsuarioId;
        var reservasNosMeusProdutos = await _db.Reservas
            .AsNoTracking()
            .Where(r => r.Produto!.DonoId == uid)
            .Include(r => r.Produto)
            .Include(r => r.Receptor)
            // --- CORREÇÃO APLICADA AQUI ---
            .OrderByDescending(r => r.DataReserva)
            .Select(r => new ReservaNoMeuProdutoResponse
            {
                Id = r.Id,
                ProdutoId = r.ProdutoId,
                ProdutoNome = r.Produto!.Nome,
                ReceptorNome = r.Receptor!.NomeCompleto ?? string.Empty,
                Status = r.Status
            })
            .ToListAsync();

        return Ok(reservasNosMeusProdutos);
    }

    [HttpPost("{id:guid}/cancelar")]
    public async Task<IActionResult> CancelarMinhaReserva([FromRoute] Guid id)
    {
        var uid = UsuarioId;
        var reserva = await _db.Reservas.Include(r => r.Produto).FirstOrDefaultAsync(r => r.Id == id);
        if (reserva == null) return NotFound();
        if (reserva.ReceptorId != uid) return Forbid();
        if (reserva.Status != StatusReserva.Ativa) return BadRequest("Apenas reservas ativas podem ser canceladas.");
        reserva.Status = StatusReserva.CanceladaPeloReceptor;
        if (reserva.Produto != null) { reserva.Produto.Status = StatusProduto.Disponivel; }
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
// --- DTOs ---

public class MinhaReservaResponse
{
    public Guid Id { get; set; }
    public Guid ProdutoId { get; set; }
    public string ProdutoNome { get; set; } = string.Empty;
    public string ProdutoImagemUrl { get; set; } = string.Empty;
    public string DonoNome { get; set; } = string.Empty;
    public StatusReserva Status { get; set; }
}

public class ReservaNoMeuProdutoResponse
{
    public Guid Id { get; set; }
    public Guid ProdutoId { get; set; }
    public string ProdutoNome { get; set; } = string.Empty;
    public string ReceptorNome { get; set; } = string.Empty;
    public StatusReserva Status { get; set; }
}