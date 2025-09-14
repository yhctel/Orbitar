using FluentValidation;
using Orbitar.Application.DTOs.Produtos;

namespace Orbitar.Application.validators;

public class ProdutoUpdateRequestValidator : AbstractValidator<ProdutoUpdateRequest>
{
    public ProdutoUpdateRequestValidator()
    {
        RuleFor(x => x.Nome).NotEmpty().MinimumLength(2);
        RuleFor(x => x.EnderecoEntrega).NotEmpty().MinimumLength(5);
        RuleFor(x => x.Categoria).IsInEnum();
        RuleFor(x => x.Condicao).IsInEnum();
        RuleFor(x => x.Status).IsInEnum();
    }
}