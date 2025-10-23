using FluentValidation;
using Orbitar.Application.DTOs.Auth;

namespace Orbitar.Application.Validators;

public class LoginRequestValidator : AbstractValidator<LoginRequest>
{
    public LoginRequestValidator()
    {
        RuleFor(x => x.Email).NotEmpty().EmailAddress();
        RuleFor(x => x.Senha).NotEmpty().MinimumLength(6);
    }
}