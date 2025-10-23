using System;

namespace Orbitar.Application.DTOs.Admin;

public record UsuarioResponse(
    string Id,
    string NomeCompleto,
    string Email,
    DateTime DataCadastro
);