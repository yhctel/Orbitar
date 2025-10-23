using Orbitar.Application.DTOs.Produtos;
using System.Collections.Generic;

namespace Orbitar.Application.DTOs.Perfil;

public record HistoricoResponse(
    List<ProdutoResponse> DoacoesFeitas,
    List<ProdutoResponse> DoacoesRecebidas
);