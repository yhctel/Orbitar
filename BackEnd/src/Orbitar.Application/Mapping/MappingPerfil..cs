using AutoMapper;
using Orbitar.Application.DTOs.Produtos;
using Orbitar.Application.DTOs.Reservations;
using Orbitar.Domain.Entities;

namespace Orbitar.Application.Mapping;

public class MappingPerfil : Profile
{
    public MappingPerfil()
    {
        CreateMap<Produto, ProdutoResponse>()
            .ForMember(d => d.DoadorId, opt => opt.MapFrom(s => s.DonoId))
            .ForMember(d => d.DoadorNome, opt => opt.MapFrom(s => s.Dono != null ? s.Dono.NomeCompleto : string.Empty));

        CreateMap<Reserva, ReservaResponse>()
            .ForMember(d => d.ProductNome, opt => opt.MapFrom(s => s.Produto != null ? s.Produto.Nome : string.Empty))
            .ForMember(d => d.DoadorId, opt => opt.MapFrom(s => s.Produto != null ? s.Produto.DonoId : string.Empty))
            .ForMember(d => d.DoadorNome, opt => opt.MapFrom(s => s.Produto != null && s.Produto.Dono != null ? s.Produto.Dono.NomeCompleto : string.Empty))
            .ForMember(d => d.ReceptorNome, opt => opt.MapFrom(s => s.Receptor != null ? s.Receptor.NomeCompleto : string.Empty));
    }
}