// Local: Orbitar.Api/Controllers/ProdutosController.cs
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Orbitar.Application.DTOs;
using Orbitar.Application.DTOs.Produtos;
using Orbitar.Domain.Entities;
using Orbitar.Domain.Enums;
using Orbitar.Infrastructure.Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Orbitar.Api.Controllers;

[ApiController]
[Route("api/produtos")]
[Authorize]
public class ProdutosController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IMapper _mapper;
    private readonly UserManager<ApplicationUser> _userManager;

    private string UsuarioAtualId => User.FindFirst(ClaimTypes.NameIdentifier)?.Value!;

    public ProdutosController(AppDbContext db, IMapper mapper, UserManager<ApplicationUser> userManager)
    {
        _db = db;
        _mapper = mapper;
        _userManager = userManager;
    }

    // GET /api/produtos
    [HttpGet]
    public async Task<ActionResult<PagedResult<ProdutoResponse>>> ObterTodos(
        [FromQuery] CategoriaProduto? categoria,
        [FromQuery] CondicaoProduto? condicao,
        [FromQuery] string? termoBusca,
        [FromQuery] int pagina = 1,
        [FromQuery] int itensPorPagina = 10)
    {
        var user = await _userManager.FindByIdAsync(UsuarioAtualId);
        if (user == null) return Unauthorized();

        var query = _db.Produtos
            .AsNoTracking()
            .Where(p => p.Cidade == user.Cidade && p.Status == StatusProduto.Disponivel);

        if (categoria.HasValue) query = query.Where(p => p.Categoria == categoria);
        if (condicao.HasValue) query = query.Where(p => p.Condicao == condicao);
        if (!string.IsNullOrWhiteSpace(termoBusca))
        {
            query = query.Where(p => p.Nome.Contains(termoBusca) || (p.Observacoes != null && p.Observacoes.Contains(termoBusca)));
        }

        var totalItens = await query.CountAsync();

        var produtos = await query
            .OrderByDescending(p => p.DataCriacao)
            .Skip((pagina - 1) * itensPorPagina)
            .Take(itensPorPagina)
            .ProjectTo<ProdutoResponse>(_mapper.ConfigurationProvider)
            .ToListAsync();

        var pagedResult = new PagedResult<ProdutoResponse>(produtos, totalItens, pagina, itensPorPagina);
        return Ok(pagedResult);
    }

    // GET /api/produtos/meus
    [HttpGet("meus")]
    public async Task<ActionResult<List<ProdutoResponse>>> ObterMeus()
    {
        var userId = UsuarioAtualId;
        var result = await _db.Produtos
            .AsNoTracking()
            .Include(p => p.Dono)
            .Where(p => p.DonoId == userId)
            .OrderByDescending(p => p.DataCriacao)
            .ProjectTo<ProdutoResponse>(_mapper.ConfigurationProvider)
            .ToListAsync();
        return Ok(result);
    }

    // GET /api/produtos/{id}
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ProdutoResponse>> ObterPorId([FromRoute] Guid id)
    {
        var produto = await _db.Produtos.Include(p => p.Dono).FirstOrDefaultAsync(p => p.Id == id);
        if (produto == null) return NotFound();

        if (produto.DonoId != UsuarioAtualId)
        {
            var user = await _userManager.FindByIdAsync(UsuarioAtualId);
            if (user == null || user.Cidade != produto.Cidade) return NotFound();
        }

        return Ok(_mapper.Map<ProdutoResponse>(produto));
    }

    // POST /api/produtos
    [HttpPost]
    public async Task<ActionResult<ProdutoResponse>> Criar([FromBody] ProdutoCreateRequest req)
    {
        var user = await _userManager.FindByIdAsync(UsuarioAtualId);
        if (user == null) return Unauthorized();

        var produto = new Produto
        {
            Nome = req.Nome,
            Categoria = req.Categoria,
            Condicao = req.Condicao,
            Observacoes = req.Observacoes,
            EnderecoEntrega = req.EnderecoEntrega,
            ImagemUrl = req.ImagemUrl,
            Cidade = user.Cidade,
            DonoId = user.Id,
            Status = StatusProduto.Disponivel
        };
        _db.Produtos.Add(produto);
        await _db.SaveChangesAsync();

        await _db.Entry(produto).Reference(p => p.Dono).LoadAsync();
        var dto = _mapper.Map<ProdutoResponse>(produto);
        return CreatedAtAction(nameof(ObterPorId), new { id = produto.Id }, dto);
    }

    // PUT /api/produtos/{id}
    [HttpPut("{id:guid}")]
    public async Task<ActionResult<ProdutoResponse>> Atualizar([FromRoute] Guid id, [FromBody] ProdutoUpdateRequest req)
    {
        var produto = await _db.Produtos.Include(p => p.Dono).FirstOrDefaultAsync(p => p.Id == id);
        if (produto == null) return NotFound();
        if (produto.DonoId != UsuarioAtualId) return Forbid();
        if (produto.Status == StatusProduto.Doado) return BadRequest("Produto já doado");

        produto.Nome = req.Nome;
        produto.Categoria = req.Categoria;
        produto.Condicao = req.Condicao;
        produto.Observacoes = req.Observacoes;
        produto.EnderecoEntrega = req.EnderecoEntrega;
        produto.ImagemUrl = req.ImagemUrl;
        produto.Status = req.Status;

        await _db.SaveChangesAsync();
        var dto = _mapper.Map<ProdutoResponse>(produto);
        return Ok(dto);
    }

    // DELETE /api/produtos/{id}
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Excluir([FromRoute] Guid id)
    {
        var produto = await _db.Produtos
            .Include(p => p.Reservas)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (produto == null)
        {
            return NotFound();
        }

        if (produto.DonoId != UsuarioAtualId)
        {
            return Forbid();
        }

        var reservaAtiva = produto.Reservas.FirstOrDefault(r => r.Status == StatusReserva.Ativa);

        if (reservaAtiva != null)
        {
            reservaAtiva.Status = StatusReserva.CanceladaPeloDoador;
            var notificacaoReceptor = new Notificacao
            {
                UsuarioId = reservaAtiva.ReceptorId,
                Mensagem = $"A reserva do produto '{produto.Nome}' foi cancelada, pois o doador removeu o anúncio."
            };
            _db.Notificacoes.Add(notificacaoReceptor);
        }

        _db.Produtos.Remove(produto);

        await _db.SaveChangesAsync();

        return NoContent();
    }

    // POST /api/produtos/{id}/marcar-doado
    [HttpPost("{id:guid}/marcar-doado")]
    public async Task<IActionResult> MarcarComoDoado([FromRoute] Guid id)
    {
        var produto = await _db.Produtos.Include(p => p.Reservas).FirstOrDefaultAsync(p => p.Id == id);
        if (produto == null) return NotFound();
        if (produto.DonoId != UsuarioAtualId) return Forbid();

        produto.Status = StatusProduto.Doado;
        produto.DataDoacao = DateTime.UtcNow;

        var ativaReserva = produto.Reservas.FirstOrDefault(r => r.Status == StatusReserva.Ativa);
        if (ativaReserva != null) ativaReserva.Status = StatusReserva.Concluida;

        await _db.SaveChangesAsync();
        return NoContent();
    }
}