import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, delay } from 'rxjs/operators';

export interface Notificacao {
  id: string;
  mensagem: string;
  lida: boolean;
  criadoEm: Date;
  link?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private mockNotificacoes: Notificacao[] = [
    { id: '1', mensagem: "Seu produto 'Notebook Dell' foi reservado por um usuário.", lida: false, criadoEm: new Date(Date.now() - 2 * 60 * 60 * 1000), link: '/minhas-doacoes' },
    { id: '2', mensagem: "Nova doação na sua cidade: 'Bicicleta Caloi'.", lida: false, criadoEm: new Date(Date.now() - 12 * 60 * 60 * 1000), link: '/catalogo' },
    { id: '3', mensagem: "Lembrete: A reserva do produto 'Microondas' expira em 2 dias.", lida: false, criadoEm: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    { id: '4', mensagem: "Sua doação 'Roupas Femininas' foi concluída. Obrigado!", lida: true, criadoEm: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
  ];

  private notificacoesSubject = new BehaviorSubject<Notificacao[]>(this.mockNotificacoes);
  public notificacoes$ = this.notificacoesSubject.asObservable();
  public unreadCount$: Observable<number> = this.notificacoes$.pipe(
    map(notificacoes => notificacoes.filter(n => !n.lida).length)
  );

  constructor() { }

  marcarComoLida(id: string): Observable<boolean> {
    const notificacao = this.mockNotificacoes.find(n => n.id === id);
    if (notificacao) {
      notificacao.lida = true;
      this.notificacoesSubject.next([...this.mockNotificacoes]);
    }
    return of(true).pipe(delay(200));
  }

  marcarTodasComoLidas(): Observable<boolean> {
    this.mockNotificacoes.forEach(n => n.lida = true);
    this.notificacoesSubject.next([...this.mockNotificacoes]);
    return of(true).pipe(delay(200));
  }
}
