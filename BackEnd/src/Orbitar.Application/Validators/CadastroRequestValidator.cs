using FluentValidation;
using Orbitar.Application.DTOs.Auth;

namespace Orbitar.Application.Validators;

public class CadastroRequestValidator : AbstractValidator<CadastroRequest>
{
    public CadastroRequestValidator()
    {
        RuleFor(x => x.NomeCompleto).NotEmpty().MinimumLength(2);
        RuleFor(x => x.Email).NotEmpty().EmailAddress();
        RuleFor(x => x.Senha).NotEmpty().MinimumLength(6);
        RuleFor(x => x.Cidade).NotEmpty();
    }
}