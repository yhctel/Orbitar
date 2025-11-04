import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface MinhaReservaResponse {
  id: string;
  produtoId: string;
  produtoNome: string;
  produtoImagemUrl: string;
  donoNome: string;
  status: number;
}

export interface ReservaNoMeuProdutoResponse {
  id: string;
  produtoId: string;
  produtoNome: string;
  receptorNome: string;
  status: number;
}

@Injectable({
  providedIn: 'root'
})
export class ReservaService {
  private apiUrl = `${environment.apiUrl}/reservas`;

  constructor(private http: HttpClient) {}

  obterMinhasReservas(): Observable<MinhaReservaResponse[]> {
    return this.http.get<MinhaReservaResponse[]>(`${this.apiUrl}/minhas`);
  }

  obterReservasNosMeusProdutos(): Observable<ReservaNoMeuProdutoResponse[]> {
    return this.http.get<ReservaNoMeuProdutoResponse[]>(`${this.apiUrl}/nos-meus-produtos`);
  }

  cancelarMinhaReserva(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/cancelar`, {});
  }
}
