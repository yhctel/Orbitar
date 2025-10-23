using Microsoft.AspNetCore.Http;

namespace Orbitar.Application.DTOs.Uploads;

public class UploadImagemRequest
{
    public IFormFile Arquivo { get; set; } = null!;
}