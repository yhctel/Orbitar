using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Orbitar.Domain.Entities;

namespace Orbitar.Infrastructure.Persistence;

public class AppDbContext : IdentityDbContext<ApplicationUser>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Produto> Produtos => Set<Produto>();
    public DbSet<Reserva> Reservas => Set<Reserva>();

    public DbSet<Notificacao> Notificacoes => Set<Notificacao>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<ApplicationUser>(b =>
        {
            b.Property(p => p.NomeCompleto).IsRequired().HasMaxLength(200);
            b.Property(p => p.Cidade).IsRequired().HasMaxLength(120);
        });

        builder.Entity<Produto>(b =>
        {
            b.Property(p => p.Nome).IsRequired().HasMaxLength(200);
            b.Property(p => p.Cidade).IsRequired().HasMaxLength(120);
            b.Property(p => p.EnderecoEntrega).IsRequired().HasMaxLength(300);
            b.HasOne(p => p.Dono)
                .WithMany()
                .HasForeignKey(p => p.DonoId)
                .OnDelete(DeleteBehavior.Restrict);
            b.HasIndex(p => new { p.Cidade, p.Status });
        });

        builder.Entity<Reserva>(b =>
        {
            b.HasOne(r => r.Produto)
                .WithMany(p => p.Reservas)
                .HasForeignKey(r => r.ProdutoId)
                .OnDelete(DeleteBehavior.Cascade);

            b.HasOne(r => r.Receptor)
                .WithMany()
                .HasForeignKey(r => r.ReceptorId)
                .OnDelete(DeleteBehavior.Restrict);

            b.HasIndex(r => new { r.Status, r.DataExpiracao });
        });

        builder.Entity<Notificacao>(b =>
        {
            b.Property(p => p.Mensagem).IsRequired().HasMaxLength(500);
            b.HasOne(n => n.Usuario)
                .WithMany()
                .HasForeignKey(n => n.UsuarioId)
                .OnDelete(DeleteBehavior.Cascade); // Se o usuário for deletado, suas notificações também são.
        });
    }
}