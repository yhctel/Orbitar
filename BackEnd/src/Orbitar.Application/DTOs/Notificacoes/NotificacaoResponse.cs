using System;

namespace Orbitar.Application.DTOs.Notificacoes;

public record NotificacaoResponse(
    Guid Id,
    string Mensagem,
    DateTime DataCriacao,
    bool Lida
);