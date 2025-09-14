using Microsoft.AspNetCore.Identity;

namespace Orbitar.Domain.Entities;

public class ApplicationUser : IdentityUser
{
    public string NomeCompleto { get; set; } = string.Empty;
    public string Cidade { get; set; } = string.Empty;
    public DateTime DataCriacao { get; set; } = DateTime.UtcNow;
}