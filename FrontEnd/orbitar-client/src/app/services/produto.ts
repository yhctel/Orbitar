import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { environment } from './../../environments/environments';

export interface Produto {
  _id: string;
  nome: string;
  imagem?: string;
  categoria: string;
  estadoConservacao: string;
  observacoes: string;
  enderecoEntrega: string;
  cidade: string;
  doadorId: string;
  status: 'disponivel' | 'reservado' | 'doado';
  criadoEm: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {
  private apiUrl = `${environment.apiUrl}/Produtos`;

  private produtosSubject = new BehaviorSubject<Produto[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public produtos$ = this.produtosSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) { }

  buscarProdutos(filtros: { categoria?: string, estado?: string, cidade?: string }): void {
  }

  buscarProdutosPorDoador(doadorId: string): void {
    this.loadingSubject.next(true);
    setTimeout(() => {
        this.produtosSubject.next([]);
        this.loadingSubject.next(false);
    }, 1000);
  }

  criarProduto(novoProduto: Omit<Produto, '_id' | 'criadoEm'>): Observable<Produto> {
    return this.http.post<Produto>(this.apiUrl, novoProduto);
  }

  atualizarProduto(produtoId: string, atualizacoes: Partial<Produto>): Observable<Produto> {
    return this.http.put<Produto>(`${this.apiUrl}/${produtoId}`, atualizacoes);
  }

  removerProduto(produtoId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${produtoId}`);
  }

  reservarProduto(produtoId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${produtoId}/reservar`, {});
  }
}
