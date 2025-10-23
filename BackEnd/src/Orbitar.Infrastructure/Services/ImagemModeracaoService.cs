using Microsoft.Extensions.Logging;
using System.IO;
using System.Threading.Tasks;
using System.Threading;
using System.Collections.Generic;
using System;

namespace Orbitar.Infrastructure.Services;

public interface IImagemModeracaoService
{
    Task<bool> IsAllowedAsync(Stream imageStream, string fileName, CancellationToken ct);
}

public class ImagemModeracaoService : IImagemModeracaoService
{
    private readonly ILogger<ImagemModeracaoService> _logger;
    private static readonly HashSet<string> AllowedExtensions = new(StringComparer.OrdinalIgnoreCase)
    { ".jpg", ".jpeg", ".png" };

    public ImagemModeracaoService(ILogger<ImagemModeracaoService> logger)
    {
        _logger = logger;
    }

    public async Task<bool> IsAllowedAsync(Stream imageStream, string fileName, CancellationToken ct)
    {
        // IMPORTANTE: Placeholder. Integre um provedor como Azure Content Safety/Moderator no futuro.
        var ext = Path.GetExtension(fileName);
        if (!AllowedExtensions.Contains(ext)) return false;
        if (!imageStream.CanRead) return false;
        if (imageStream.Length == 0) return false;

        // leitura superficial para evitar uploads maliciosos gigantes
        var buffer = new byte[Math.Min(1024, (int)imageStream.Length)];
        _ = await imageStream.ReadAsync(buffer.AsMemory(0, buffer.Length), ct);
        imageStream.Position = 0;

        // Heurística simples: bloquear nomes suspeitos
        var name = Path.GetFileNameWithoutExtension(fileName);
        if (name.Contains("nsfw", StringComparison.OrdinalIgnoreCase))
        {
            _logger.LogWarning("Imagem bloqueada por heurística de nome: {File}", fileName);
            return false;
        }
        return true;
    }
}