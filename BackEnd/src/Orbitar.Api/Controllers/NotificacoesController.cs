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
    // Adicionar um método para marcar como lida depois...
}