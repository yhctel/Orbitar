using Orbitar.Domain.Enums;
using System;

namespace Orbitar.Application.DTOs.Produtos;

public record ProdutoResponse(
    Guid Id,
    string Nome,
    CategoriaProduto Categoria,
    CondicaoProduto Condicao,
    string? Observacoes,
    string Cidade,
    string EnderecoEntrega,
    string? ImagemUrl,
    StatusProduto Status,
    DateTime DataCriacao,
    string DoadorId,
    string DoadorNome
)
{
    public ProdutoResponse() : this(default, default!, default, default, default, default!, default!, default, default, default, default!, default!) { }
}