import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

interface Estado {
  sigla: string;
}
interface Cidade {
  nome: string;
}

@Injectable({
  providedIn: 'root'
})
export class IbgeService {
  private urlEstados = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados';

  constructor(private http: HttpClient) {}

  // Método para buscar todas as cidades do Brasil
  getCidades(): Observable<string[]> {
    // 1. Primeiro, busca a lista de todos os estados (UFs)
    return this.http.get<Estado[]>(this.urlEstados).pipe(
      // 2. Com a lista de estados, faz uma chamada para cada estado para buscar suas cidades
      switchMap(estados => {
        // Cria um array de observables, um para cada estado
        const requests = estados.map(estado =>
          this.http.get<Cidade[]>(`${this.urlEstados}/${estado.sigla}/municipios`).pipe(
            catchError(error => {
              console.error(`Erro ao buscar cidades para o estado ${estado.sigla}`, error);
              return of([]); // Retorna um array vazio em caso de erro para não quebrar a chamada principal
            })
          )
        );
        // forkJoin executa todas as requisições em paralelo e retorna quando todas estiverem completas
        return forkJoin(requests);
      }),
      // 3. Junta os resultados de todas as chamadas em um único array de nomes de cidades
      map(arraysDeCidades => {
        const todasAsCidades = arraysDeCidades.flat().map(cidade => cidade.nome);
        // Ordena as cidades em ordem alfabética
        return todasAsCidades.sort();
      })
    );
  }
}
