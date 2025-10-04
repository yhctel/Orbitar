using System;

namespace Orbitar.Domain.Entities;

public class Notificacao
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Mensagem { get; set; } = string.Empty;
    public DateTime DataCriacao { get; set; } = DateTime.UtcNow;
    public bool Lida { get; set; } = false;
    public string UsuarioId { get; set; } = string.Empty;
    public ApplicationUser? Usuario { get; set; }
}