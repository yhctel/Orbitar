using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Orbitar.Application.DTOs.Perfil;
using Orbitar.Application.DTOs.Produtos;
using Orbitar.Domain.Enums;
using Orbitar.Infrastructure.Persistence;
using System.Security.Claims;

[ApiController]
[Route("api/perfil")]
[Authorize]
public class PerfilController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IMapper _mapper;
    private string UsuarioId => User.FindFirst(ClaimTypes.NameIdentifier)?.Value!;

    public PerfilController(AppDbContext db, IMapper mapper) { _db = db; _mapper = mapper; }

    [HttpGet("historico")]
    public async Task<ActionResult<HistoricoResponse>> ObterHistorico()
    {
        var doacoesFeitas = await _db.Produtos
            .Where(p => p.DonoId == UsuarioId && p.Status == StatusProduto.Doado)
            .ProjectTo<ProdutoResponse>(_mapper.ConfigurationProvider)
            .ToListAsync();

        var doacoesRecebidas = await _db.Reservas
            .Where(r => r.ReceptorId == UsuarioId && r.Status == StatusReserva.Concluida)
            .Include(r => r.Produto)
            .ThenInclude(p => p!.Dono) // Adicionado '!' para suprimir o aviso
            .Select(r => r.Produto!) // O '!' aqui também é uma boa prática
            .ProjectTo<ProdutoResponse>(_mapper.ConfigurationProvider)
            .ToListAsync();

        return Ok(new HistoricoResponse(doacoesFeitas, doacoesRecebidas));
    }
}