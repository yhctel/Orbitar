using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Orbitar.Application.DTOs.Admin;
using Orbitar.Domain.Entities;
using Orbitar.Domain.Enums;
using Orbitar.Infrastructure.Persistence;

[ApiController]
[Route("api/admin")]
[Authorize(Roles = "Admin")] // <-- Protege o controller inteiro
public class AdminController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly AppDbContext _db;

    public AdminController(UserManager<ApplicationUser> userManager, AppDbContext db)
    {
        _userManager = userManager;
        _db = db;
    }

    [HttpGet("usuarios")]
    public async Task<ActionResult<List<UsuarioResponse>>> ObterUsuarios()
    {
        var usuarios = await _userManager.Users
            .Select(u => new UsuarioResponse(u.Id, u.NomeCompleto, u.Email!, u.DataCriacao))
            .ToListAsync();
        return Ok(usuarios);
    }

    [HttpGet("estatisticas")]
    public async Task<ActionResult<EstatisticasResponse>> ObterEstatisticas()
    {
        var totalUsuarios = await _userManager.Users.CountAsync();
        var totalProdutos = await _db.Produtos.CountAsync(p => p.Status == StatusProduto.Disponivel);
        var totalDoacoes = await _db.Produtos.CountAsync(p => p.Status == StatusProduto.Doado);

        return Ok(new EstatisticasResponse(totalUsuarios, totalProdutos, totalDoacoes));
    }
}