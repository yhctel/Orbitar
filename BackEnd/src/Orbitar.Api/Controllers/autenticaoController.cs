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

    private string UsuarioId => User.FindFirst(ClaimTypes.NameIdentifier)?.Value!;

    public autenticacaoController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, IJwtTokenService jwt, IValidator<CadastroRequest> cadastroValidator, IValidator<LoginRequest> loginValidator)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _jwt = jwt;
        _cadastroValidator = cadastroValidator;
        _loginValidator = loginValidator;
    }

    [HttpPost("cadastro")]
    public async Task<ActionResult<AuthResponse>> Cadastro([FromBody] CadastroRequest req)
    {
        var validation = await _cadastroValidator.ValidateAsync(req);
        if (!validation.IsValid) return BadRequest(validation.Errors.Select(e => e.ErrorMessage));
        var exists = await _userManager.FindByEmailAsync(req.Email);
        if (exists != null) return Conflict("E-mail já cadastrado.");
        var user = new ApplicationUser { UserName = req.Email, Email = req.Email, NomeCompleto = req.NomeCompleto, Cidade = req.Cidade };
        var create = await _userManager.CreateAsync(user, req.Senha);
        if (!create.Succeeded) return BadRequest(create.Errors.Select(e => e.Description));
        var token = _jwt.GenerateToken(user);
        return Ok(new AuthResponse(token, user.Id, user.NomeCompleto, user.Email!, user.Cidade));
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest req)
    {
        var validation = await _loginValidator.ValidateAsync(req);
        if (!validation.IsValid) return BadRequest(validation.Errors.Select(e => e.ErrorMessage));
        var user = await _userManager.FindByEmailAsync(req.Email);
        if (user == null) return Unauthorized("Credenciais inválidas");
        var result = await _signInManager.CheckPasswordSignInAsync(user, req.Senha, false);
        if (!result.Succeeded) return Unauthorized("Credenciais inválidas");
        var token = _jwt.GenerateToken(user);
        return Ok(new AuthResponse(token, user.Id, user.NomeCompleto, user.Email!, user.Cidade));
    }

    [HttpGet("meu-perfil")]
    [Authorize]
    public async Task<ActionResult<PerfilUsuarioResponse>> GetMeuPerfil()
    {
        var user = await _userManager.FindByIdAsync(UsuarioId);
        if (user == null) return NotFound();
        var perfilResponse = new PerfilUsuarioResponse { UserId = user.Id, Nome = user.NomeCompleto, Email = user.Email!, Cidade = user.Cidade };
        return Ok(perfilResponse);
    }

    [HttpPut("meu-perfil")]
    [Authorize]
    public async Task<IActionResult> AtualizarPerfil([FromBody] AtualizarPerfilRequest req)
    {
        var user = await _userManager.FindByIdAsync(UsuarioId);
        if (user == null) return NotFound("Usuário não encontrado.");
        user.NomeCompleto = req.NomeCompleto;
        var result = await _userManager.UpdateAsync(user);
        if (!result.Succeeded) return BadRequest(result.Errors.Select(e => e.Description));
        return Ok("Perfil atualizado com sucesso.");
    }


    [HttpPost("verificar-senha")]
    [Authorize]
    public async Task<ActionResult<bool>> CheckCurrentPassword([FromBody] CheckPasswordRequest req)
    {
        var user = await _userManager.FindByIdAsync(UsuarioId);
        if (user == null) return Unauthorized();
        var isCorrect = await _userManager.CheckPasswordAsync(user, req.Senha);
        return Ok(isCorrect);
    }

    [HttpPost("solicitar-alteracao-cidade")]
    [Authorize]
    public async Task<IActionResult> RequestCityChange([FromBody] RequestCityChangeRequest req)
    {
        return Ok(new { message = "Email de confirmação para alteração de cidade enviado." });
    }

    [HttpPost("solicitar-alteracao-senha")]
    [Authorize]
    public async Task<IActionResult> RequestPasswordChange([FromBody] RequestPasswordChangeRequest req)
    {
        return Ok(new { message = "Email de confirmação para alteração de senha enviado." });
    }


    [HttpPost("confirmar-senha")]
    [AllowAnonymous]
    public async Task<IActionResult> ConfirmarSenha([FromBody] ConfirmarTokenRequest req)
    {
        if (string.IsNullOrEmpty(req.Token)) return BadRequest("Token é necessário.");
        return Ok(new { message = "Senha alterada com sucesso." });
    }

    [HttpPost("confirmar-cidade")]
    [AllowAnonymous]
    public async Task<ActionResult<AuthResponse>> ConfirmarCidade([FromBody] ConfirmarTokenRequest req)
    {
        if (string.IsNullOrEmpty(req.Token)) return BadRequest("Token é necessário.");
        return Ok(new AuthResponse(null, "user-id-simulado", "Nome Simulado", "email@simulado.com", "Nova Cidade"));
    }

}
public class ConfirmarTokenRequest { public string Token { get; set; } = string.Empty; }
public class PerfilUsuarioResponse { public string UserId { get; set; } = string.Empty; public string Nome { get; set; } = string.Empty; public string Email { get; set; } = string.Empty; public string Cidade { get; set; } = string.Empty; }
public class CheckPasswordRequest { public string Senha { get; set; } = string.Empty; }
public class RequestCityChangeRequest { public string NovaCidade { get; set; } = string.Empty; }
public class RequestPasswordChangeRequest { public string NovaSenha { get; set; } = string.Empty; }