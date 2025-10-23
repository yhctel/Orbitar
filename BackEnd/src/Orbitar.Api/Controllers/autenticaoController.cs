// Local: Orbitar.Api/Controllers/AutenticacaoController.cs
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Orbitar.Application.DTOs.Auth;
using Orbitar.Domain.Entities;
using Orbitar.Infrastructure.Services;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Orbitar.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class autenticacaoController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly IJwtTokenService _jwt;
    private readonly IValidator<CadastroRequest> _cadastroValidator;
    private readonly IValidator<LoginRequest> _loginValidator;

    // Propriedade para pegar o ID do usuário logado a partir do token
    private string UsuarioId => User.FindFirst(ClaimTypes.NameIdentifier)?.Value!;

    public autenticacaoController(
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager,
        IJwtTokenService jwt,
        IValidator<CadastroRequest> cadastroValidator,
        IValidator<LoginRequest> loginValidator)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _jwt = jwt;
        _cadastroValidator = cadastroValidator;
        _loginValidator = loginValidator;
    }

    // POST /api/autenticacao/cadastro
    [HttpPost("cadastro")]
    public async Task<ActionResult<AuthResponse>> Cadastro([FromBody] CadastroRequest req)
    {
        var validation = await _cadastroValidator.ValidateAsync(req);
        if (!validation.IsValid)
            return BadRequest(validation.Errors.Select(e => e.ErrorMessage));

        var exists = await _userManager.FindByEmailAsync(req.Email);
        if (exists != null) return Conflict("E-mail já cadastrado.");

        var user = new ApplicationUser
        {
            UserName = req.Email,
            Email = req.Email,
            NomeCompleto = req.NomeCompleto,
            Cidade = req.Cidade
        };

        var create = await _userManager.CreateAsync(user, req.Senha);
        if (!create.Succeeded)
            return BadRequest(create.Errors.Select(e => e.Description));

        var token = _jwt.GenerateToken(user);
        return Ok(new AuthResponse(token, user.Id, user.NomeCompleto, user.Email!, user.Cidade));
    }

    // POST /api/autenticacao/login
    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest req)
    {
        var validation = await _loginValidator.ValidateAsync(req);
        if (!validation.IsValid)
            return BadRequest(validation.Errors.Select(e => e.ErrorMessage));

        var user = await _userManager.FindByEmailAsync(req.Email);
        if (user == null) return Unauthorized("Credenciais inválidas");

        var result = await _signInManager.CheckPasswordSignInAsync(user, req.Senha, false);
        if (!result.Succeeded) return Unauthorized("Credenciais inválidas");

        var token = _jwt.GenerateToken(user);
        return Ok(new AuthResponse(token, user.Id, user.NomeCompleto, user.Email!, user.Cidade));
    }

    // PUT /api/autenticacao/meu-perfil
    [HttpPut("meu-perfil")]
    [Authorize]
    public async Task<IActionResult> AtualizarPerfil([FromBody] AtualizarPerfilRequest req)
    {
        var user = await _userManager.FindByIdAsync(UsuarioId);
        if (user == null)
        {
            return NotFound("Usuário não encontrado.");
        }

        user.NomeCompleto = req.NomeCompleto;
        user.Cidade = req.Cidade;

        var result = await _userManager.UpdateAsync(user);

        if (!result.Succeeded)
        {
            return BadRequest(result.Errors.Select(e => e.Description));
        }

        return Ok("Perfil atualizado com sucesso.");
    }

    // PUT /api/autenticacao/atualizar-senha
    [HttpPut("atualizar-senha")]
    [Authorize]
    public async Task<IActionResult> AtualizarSenha([FromBody] AtualizarSenhaRequest req)
    {
        var user = await _userManager.FindByIdAsync(UsuarioId);
        if (user == null)
        {
            return NotFound("Usuário não encontrado.");
        }

        var result = await _userManager.ChangePasswordAsync(user, req.SenhaAntiga, req.SenhaNova);

        if (!result.Succeeded)
        {
            return BadRequest(result.Errors.Select(e => e.Description));
        }

        return Ok("Senha atualizada com sucesso.");
    }

    // DELETE /api/autenticacao/excluir-conta
    [HttpDelete("excluir-conta")]
    [Authorize]
    public async Task<IActionResult> ExcluirConta()
    {
        var user = await _userManager.FindByIdAsync(UsuarioId);
        if (user == null)
        {
            return NotFound("Usuário não encontrado.");
        }

        var result = await _userManager.DeleteAsync(user);

        if (!result.Succeeded)
        {
            return BadRequest(result.Errors.Select(e => e.Description));
        }

        return NoContent(); // Resposta 204 No Content para sucesso na exclusão
    }
}