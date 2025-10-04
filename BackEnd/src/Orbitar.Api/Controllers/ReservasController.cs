using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Orbitar.Domain.Entities;
using Orbitar.Domain.Enums;
using Orbitar.Infrastructure.Persistence;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Orbitar.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ReservasController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly UserManager<ApplicationUser> _userManager;

    public ReservasController(AppDbContext db, UserManager<ApplicationUser> userManager)
    { _db = db; _userManager = userManager; }

    private string UsuarioAtualId => User.FindFirst("sub")?.Value ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value!;

    [HttpPost("{produtoId:guid}")]
    public async Task<IActionResult> Reserve([FromRoute] Guid produtoId)
    {
        var usuario = await _userManager.FindByIdAsync(UsuarioAtualId);
        if (usuario == null) return Unauthorized();

        var produto = await _db.Produtos.Include(p => p.Dono).FirstOrDefaultAsync(p => p.Id == produtoId);
        if (produto == null) return NotFound();
        if (produto.Status != StatusProduto.Disponivel) return BadRequest("Produto não disponível");
        if (produto.Cidade != usuario.Cidade) return BadRequest("Produto de outra cidade");
        if (produto.DonoId == usuario.Id) return BadRequest("Não é possível reservar o próprio produto");

        produto.Status = StatusProduto.Reservado;
        var reserva = new Reserva
        {
            ProdutoId = produto.Id,
            ReceptorId = usuario.Id,
            DataReserva = DateTime.UtcNow,
            DataExpiracao = DateTime.UtcNow.AddDays(7),
            Status = StatusReserva.Ativa
        };
        _db.Reservas.Add(reserva);
        await _db.SaveChangesAsync();

        var notificacaoDoador = new Notificacao
        {
            UsuarioId = produto.DonoId,
            Mensagem = $"Seu produto '{produto.Nome}' foi reservado por {usuario.NomeCompleto}."
        };
        _db.Notificacoes.Add(notificacaoDoador);
        await _db.SaveChangesAsync();
        return Ok(new { reserva.Id, reserva.DataExpiracao });
    }

    [HttpGet("minhas")]
    public async Task<IActionResult> MyReservations()
    {
        var uid = UsuarioAtualId;
        var mine = await _db.Reservas
            .Include(r => r.Produto)!.ThenInclude(p => p!.Dono)
            .Where(r => r.ReceptorId == uid)
            .OrderByDescending(r => r.DataReserva)
            .Select(r => new
            {
                r.Id,
                Produto = r.Produto!.Nome,
                DonorNome = r.Produto!.Dono!.NomeCompleto,
                r.DataReserva,
                r.DataExpiracao,
                r.Status
            })
            .ToListAsync();
        return Ok(mine);
    }

    [HttpPost("{ReservaId:guid}/cancelar")]
    public async Task<IActionResult> Cancel([FromRoute] Guid reservaId)
    {
        var uid = UsuarioAtualId;
        var res = await _db.Reservas.Include(r => r.Produto).FirstOrDefaultAsync(r => r.Id == reservaId);
        if (res == null) return NotFound();
        if (res.ReceptorId != uid) return Forbid();
        if (res.Status != StatusReserva.Ativa) return BadRequest("Reserva não está ativa");

        res.Status = StatusReserva.Cancelada;
        if (res.Produto != null && res.Produto.Status == StatusProduto.Reservado)
            res.Produto.Status = StatusProduto.Disponivel;

        await _db.SaveChangesAsync();
        return NoContent();
    }
}