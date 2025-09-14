﻿using Microsoft.AspNetCore.Http;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using System.Linq;

namespace Orbitar.Api.Filters;

public class UploadFilter : IOperationFilter
{
    public void Apply(OpenApiOperation operation, OperationFilterContext context)
    {
        var fileParams = context.MethodInfo.GetParameters()
            .Where(p => p.ParameterType == typeof(IFormFile) || p.ParameterType == typeof(IFormFileCollection));

        if (fileParams.Any())
        {
            operation.RequestBody = new OpenApiRequestBody
            {
                Content =
                {
                    ["multipart/form-data"] = new OpenApiMediaType
                    {
                        Schema = new OpenApiSchema
                        {
                            Type = "object",
                            Properties = fileParams.ToDictionary(
                                p => p.Name!,
                                p => new OpenApiSchema
                                {
                                    Type = "string",
                                    Format = "binary"
                                }
                            )
                        }
                    }
                }
            };
        }
    }
}