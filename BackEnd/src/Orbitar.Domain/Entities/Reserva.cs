using Orbitar.Domain.Enums;

namespace Orbitar.Domain.Entities;

public class Reserva
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ProdutoId { get; set; }
    public Produto? Produto { get; set; }
    public string ReceptorId { get; set; } = string.Empty;
    public ApplicationUser? Receptor { get; set; }
    public DateTime DataReserva { get; set; } = DateTime.UtcNow;
    public DateTime DataExpiracao { get; set; }
    public StatusReserva Status { get; set; } = StatusReserva.Ativa;
    public DateTime DataCriacao { get; set; }
}