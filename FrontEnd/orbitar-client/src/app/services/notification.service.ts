import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, map } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Notificacao {
  id: string;
  mensagem: string;
  dataCriacao: string;
  lida: boolean;
  link?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = `${environment.apiUrl}/notificacoes`;

  private notificacoesSubject = new BehaviorSubject<Notificacao[]>([]);
  public notificacoes$ = this.notificacoesSubject.asObservable();
  public unreadCount$: Observable<number>;

  constructor(private http: HttpClient) {
    this.unreadCount$ = this.notificacoes$.pipe(
      map(notificacoes => notificacoes.filter(n => !n.lida).length)
    );
  }

  buscarNotificacoes(): void {
    this.http.get<Notificacao[]>(`${this.apiUrl}/minhas`).subscribe(notificacoes => {
      this.notificacoesSubject.next(notificacoes);
    });
  }

  marcarComoLida(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/marcar-lida`, {}).pipe(
      tap(() => {
        const notificacoesAtuais = this.notificacoesSubject.getValue();
        const notificacoesAtualizadas = notificacoesAtuais.map(n =>
          n.id === id ? { ...n, lida: true } : n
        );
        this.notificacoesSubject.next(notificacoesAtualizadas);
      })
    );
  }

  marcarTodasComoLidas(): void {
    this.http.post(`${this.apiUrl}/marcar-todas-lidas`, {}).subscribe(() => {
      const notificacoesAtuais = this.notificacoesSubject.getValue();
      const notificacoesAtualizadas = notificacoesAtuais.map(n => ({ ...n, lida: true }));
      this.notificacoesSubject.next(notificacoesAtualizadas);
    });
  }
}
