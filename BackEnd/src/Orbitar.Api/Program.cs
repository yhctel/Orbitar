using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Orbitar.Domain.Entities;
using Orbitar.Infrastructure.Persistence;
using Orbitar.Infrastructure.Services;
using Microsoft.AspNetCore.Identity;
using Orbitar.Api.Filters;
using FluentValidation;
using Orbitar.Application.Validators;
using Orbitar.Application.Mapping;

var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;

// DB
builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseSqlServer(configuration.GetConnectionString("Default")));

// Identity + JWT
builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
    .AddEntityFrameworkStores<AppDbContext>()
    .AddDefaultTokenProviders();


var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"]!));

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = configuration["Jwt:Issuer"],
        ValidAudience = configuration["Jwt:Audience"],
        IssuerSigningKey = key,
        // Adicionar ClockSkew pode ajudar se houver pequenas diferenças de tempo
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddAuthorization();

//builder.Services.AddAutoMapper(typeof(MappingPerfil).Assembly);
builder.Services.AddAutoMapper(cfg =>
{
    cfg.AddProfile<MappingPerfil>();
});
builder.Services.AddValidatorsFromAssemblyContaining<CadastroRequestValidator>();
builder.Services.AddScoped<IJwtTokenService, JwtTokenService>();
builder.Services.AddScoped<IImagemArmazenamentoService, LocalImagemArmazenamentoService>();
builder.Services.AddSingleton<IImagemModeracaoService, ImagemModeracaoService>();

builder.Services.AddControllers();

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Orbitar API", Version = "v1" });
    c.OperationFilter<UploadFilter>();

    var securityScheme = new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
    };
    c.AddSecurityDefinition("Bearer", securityScheme);
    c.AddSecurityRequirement(new OpenApiSecurityRequirement { { securityScheme, new string[] { } } });
});

builder.Services.AddDirectoryBrowser();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseStaticFiles(); 
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();