using System.IO;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using System;

namespace Orbitar.Infrastructure.Services;

public interface IImagemArmazenamentoService
{
    Task<string> SaveAsync(Stream stream, string fileName, CancellationToken ct);
}

public class LocalImagemArmazenamentoService : IImagemArmazenamentoService
{
    private readonly IWebHostEnvironment _env;

    public LocalImagemArmazenamentoService(IWebHostEnvironment env)
    {
        _env = env;
    }

    public async Task<string> SaveAsync(Stream stream, string fileName, CancellationToken ct)
    {
        var uploadsDir = Path.Combine(_env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot"), "uploads");
        Directory.CreateDirectory(uploadsDir);
        var safeName = $"{Guid.NewGuid():N}{Path.GetExtension(fileName)}";
        var fullPath = Path.Combine(uploadsDir, safeName);
        await using var fs = File.Create(fullPath);
        await stream.CopyToAsync(fs, ct);
        var relative = $"/uploads/{safeName}";
        return relative; // URL relativa servida por StaticFiles
    }
}