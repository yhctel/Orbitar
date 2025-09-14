using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Orbitar.Application.DTOs.Auth;

public record AtualizarPerfilRequest(
    string NomeCompleto,
    string Cidade
);