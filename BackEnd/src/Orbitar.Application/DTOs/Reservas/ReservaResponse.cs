using Orbitar.Domain.Enums;

namespace Orbitar.Application.DTOs.Reservations;

public record ReservaResponse(
    Guid Id,
    Guid ProductId,
    string ProductNome,
    string DoadorId,
    string DoadorNome,
    string ReceptorId,
    string ReceptorNome,
    DateTime DataReserva,
    DateTime DataExpiracao,
    StatusReserva Status
);