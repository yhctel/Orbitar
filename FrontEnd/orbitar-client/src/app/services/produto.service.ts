import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';

export interface Produto {
  id: string;
  nome: string;
  imagemUrl: string;
  cidade: string;
  status: number;
  condicao: number;
  dono: { nomeCompleto: string; };
  observacoes?: string;
  enderecoEntrega?: string;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

@Injectable({ providedIn: 'root' })
export class ProdutoService {
  private apiUrl = 'https://localhost:7034/api/produtos'; // Verifique a porta!

  private produtosSubject = new BehaviorSubject<Produto[]>([]);
  public produtos$ = this.produtosSubject.asObservable();
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) { }

  buscarProdutos(filtros: { categoria?: string, estado?: string }): void {
    this.loadingSubject.next(true);
    let params = new HttpParams();
    const categoriaEnum = this.mapCategoriaParaEnum(filtros.categoria);
    const condicaoEnum = this.mapCondicaoParaEnum(filtros.estado);
    if (categoriaEnum !== null) params = params.append('categoria', categoriaEnum.toString());
    if (condicaoEnum !== null) params = params.append('condicao', condicaoEnum.toString());

    this.http.get<PagedResult<Produto>>(this.apiUrl, { params }).pipe(
      tap(response => {
        this.produtosSubject.next(response.items);
        this.loadingSubject.next(false);
      }),
      catchError(err => {
        console.error("Erro ao buscar produtos:", err);
        this.produtosSubject.next([]);
        this.loadingSubject.next(false);
        return of(null);
      })
    ).subscribe();
  }

  buscarProdutosPorDoador(): Observable<Produto[]> {
    return this.http.get<Produto[]>(`${this.apiUrl}/meus`);
  }

  // --- MÉTODO ADICIONADO ---
  criarProduto(novoProduto: any): Observable<Produto> {
    return this.http.post<Produto>(this.apiUrl, novoProduto);
  }

  atualizarProduto(produtoId: string, atualizacoes: Partial<Produto>): Observable<Produto> {
    return this.http.put<Produto>(`${this.apiUrl}/${produtoId}`, atualizacoes);
  }

  // --- MÉTODO ADICIONADO ---
  removerProduto(produtoId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${produtoId}`);
  }

  reservarProduto(produtoId: string): Observable<boolean> {
    return this.http.post(`${this.apiUrl}/${produtoId}/reservar`, {}).pipe(
      map(() => true),
      catchError(err => {
        console.error("Erro ao reservar produto:", err);
        return of(false);
      })
    );
  }

  private mapCategoriaParaEnum(categoria?: string): number | null {
    if (!categoria || categoria === 'Todas as Categorias') return null;
    const map = { 'Eletrônicos': 0, 'Roupas': 1, 'Livros': 2, 'Brinquedos': 3, 'Móveis': 4 };
    return map[categoria as keyof typeof map] ?? null;
  }

  private mapCondicaoParaEnum(condicao?: string): number | null {
    if (!condicao || condicao === 'Todos os Estados') return null;
    const map = { 'Bom Estado': 0, 'Seminovo': 1, 'Com Defeito': 2 };
    return map[condicao as keyof typeof map] ?? null;
  }
}
