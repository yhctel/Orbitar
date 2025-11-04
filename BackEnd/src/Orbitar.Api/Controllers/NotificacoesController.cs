using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Orbitar.Application.DTOs.Notificacoes;
using Orbitar.Infrastructure.Persistence;
using System.Security.Claims;

[ApiController]
[Route("api/notificacoes")]
[Authorize]
public class NotificacoesController : ControllerBase
{
    private readonly AppDbContext _db;
    private string UsuarioId => User.FindFirst(ClaimTypes.NameIdentifier)?.Value!;

    public NotificacoesController(AppDbContext db) { _db = db; }

    [HttpGet("minhas")]
    public async Task<IActionResult> ObterMinhasNotificacoes()
    {
        var notificacoes = await _db.Notificacoes
            .Where(n => n.UsuarioId == UsuarioId)
            .OrderByDescending(n => n.DataCriacao)
            .Select(n => new NotificacaoResponse(n.Id, n.Mensagem, n.DataCriacao, n.Lida))
            .ToListAsync();
        return Ok(notificacoes);
    }

    [HttpPost("{id:guid}/marcar-lida")]
    public async Task<IActionResult> MarcarComoLida(Guid id)
    {
        var notificacao = await _db.Notificacoes
            .FirstOrDefaultAsync(n => n.Id == id && n.UsuarioId == UsuarioId);

        if (notificacao == null)
        {
            return NotFound();
        }

        notificacao.Lida = true;
        await _db.SaveChangesAsync();

        return NoContent();
    }

    [HttpPost("marcar-todas-lidas")]
    public async Task<IActionResult> MarcarTodasComoLidas()
    {
        var notificacoesNaoLidas = await _db.Notificacoes
            .Where(n => n.UsuarioId == UsuarioId && !n.Lida)
            .ToListAsync();

        if (!notificacoesNaoLidas.Any())
        {
            return Ok();
        }

        foreach (var notificacao in notificacoesNaoLidas)
        {
            notificacao.Lida = true;
        }

        await _db.SaveChangesAsync();
        return NoContent();
    }
}