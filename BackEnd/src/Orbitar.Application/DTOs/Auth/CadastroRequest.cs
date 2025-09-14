namespace Orbitar.Application.DTOs.Auth;

public record CadastroRequest(
    string NomeCompleto,
    string Email,
    string Senha,
    string Cidade
);