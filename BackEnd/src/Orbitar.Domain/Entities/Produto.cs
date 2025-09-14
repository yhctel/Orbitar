using Orbitar.Domain.Enums;
using System;
using System.Collections.Generic;

namespace Orbitar.Domain.Entities;

public class Produto
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Nome { get; set; } = string.Empty;
    public CategoriaProduto Categoria { get; set; }
    public CondicaoProduto Condicao { get; set; }
    public string? Observacoes { get; set; }
    public string Cidade { get; set; } = string.Empty;
    public string EnderecoEntrega { get; set; } = string.Empty;
    public string? ImagemUrl { get; set; }
    public StatusProduto Status { get; set; } = StatusProduto.Disponivel;
    public DateTime DataCriacao { get; set; } = DateTime.UtcNow;
    public DateTime? DataDoacao { get; set; }
    public string DonoId { get; set; } = string.Empty; 
    public ApplicationUser? Dono { get; set; }
    public ICollection<Reserva> Reservas { get; set; } = new List<Reserva>();
}