using Orbitar.Domain.Enums;

namespace Orbitar.Application.DTOs.Produtos;

public record ProdutoCreateRequest(
    string Nome,
    CategoriaProduto Categoria,
    CondicaoProduto Condicao,
    string EnderecoEntrega,
    string? Observacoes,
    string? ImagemUrl
);