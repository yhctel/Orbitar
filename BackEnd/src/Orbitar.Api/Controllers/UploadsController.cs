using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Orbitar.Infrastructure.Services;
using System.Threading;
using System.Threading.Tasks;
using Orbitar.Application.DTOs.Uploads;

namespace Orbitar.Api.Controllers;

[ApiController]
[Route("api/uploads")]
[Authorize]
public class UploadsController : ControllerBase
{
    private readonly IImagemModeracaoService _moderacaoService;
    private readonly IImagemArmazenamentoService _armazenamentoService;

    public UploadsController(IImagemModeracaoService moderacaoService, IImagemArmazenamentoService armazenamentoService)
    {
        _moderacaoService = moderacaoService;
        _armazenamentoService = armazenamentoService;
    }

    [HttpPost("imagem")]
    [RequestSizeLimit(10 * 1024 * 1024)] // 10 MB
    public async Task<IActionResult> UploadImagem([FromForm] UploadImagemRequest request, CancellationToken ct)
    {
        if (request.Arquivo == null || request.Arquivo.Length == 0)
            return BadRequest("Imagem inválida");

        await using var stream = request.Arquivo.OpenReadStream();
        var aprovada = await _moderacaoService.IsAllowedAsync(stream, request.Arquivo.FileName, ct);
        if (!aprovada)
            return BadRequest("Imagem reprovada pela moderação");

        stream.Position = 0;
        var url = await _armazenamentoService.SaveAsync(stream, request.Arquivo.FileName, ct);

        return Ok(new { url });
    }
}