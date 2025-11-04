import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

export interface LoginRequest {
  email: string;
  Senha: string;
}

export interface CadastroRequest {
  nomeCompleto: string;
  email: string;
  senha: string;
  cidade: string;
}

export interface AuthResponse {
  token: string;
  id: string;
  nomeCompleto: string;
  email: string;
  cidade: string;
}

export interface PerfilUsuario {
  userId: string;
  nome: string;
  email: string;
  cidade: string;
  telefone?: string;
  avatar?: string;
  biografia?: string;
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/autenticacao`;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(!!localStorage.getItem('authToken'));
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  login(loginData: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, loginData).pipe(
      tap(response => {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('userData', JSON.stringify(response));
        this.isAuthenticatedSubject.next(true);
      })
    );
  }

  cadastro(cadastroData: CadastroRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/cadastro`, cadastroData).pipe(
      tap(response => {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('userData', JSON.stringify(response));
        this.isAuthenticatedSubject.next(true);
      })
    );
  }

  signOut(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  getCurrentUser(): AuthResponse | null {
    const user = localStorage.getItem('userData');
    return user ? JSON.parse(user) : null;
  }

  getPerfil(): Observable<PerfilUsuario> {
    return this.http.get<PerfilUsuario>(`${this.apiUrl}/meu-perfil`);
  }

  updatePerfil(perfilAtualizado: Partial<PerfilUsuario>): Observable<any> {
    return this.http.put(`${this.apiUrl}/meu-perfil`, perfilAtualizado);
  }

  checkCurrentPassword(password: string): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}/verificar-senha`, { senha: password });
  }
  requestCityChange(newCity: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/solicitar-alteracao-cidade`, { novaCidade: newCity });
  }

  requestPasswordChange(newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/solicitar-alteracao-senha`, { novaSenha: newPassword });
  }

  confirmCityChange(token: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/confirmar-cidade`, { token }).pipe(
      tap(response => {
        localStorage.setItem('userData', JSON.stringify(response));
      })
    );
  }

  confirmPasswordChange(token: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/confirmar-senha`, { token });
  }
}
