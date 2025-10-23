namespace Orbitar.Application.DTOs.Auth;

public record AuthResponse(
    string Token,
    string UsuarioId,
    string Nome,
    string Email,
    string Cidade
);