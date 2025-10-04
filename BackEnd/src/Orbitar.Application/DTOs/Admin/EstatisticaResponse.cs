namespace Orbitar.Application.DTOs.Admin;

public record EstatisticasResponse(
    int TotalUsuarios,
    int TotalProdutosDisponiveis,
    int TotalDoacoesConcluidas
);