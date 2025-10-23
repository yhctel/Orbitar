using System.Collections.Generic;

namespace Orbitar.Application.DTOs;

public record PagedResult<T>(
    List<T> Itens,
    int TotalItens,
    int PaginaAtual,
    int ItensPorPagina
);