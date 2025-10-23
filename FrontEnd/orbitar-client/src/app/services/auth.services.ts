import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { environment } from './../../environments/environments';

export interface LoginRequest { email: string; senha: string; }
export interface CadastroRequest { nome: string; email: string; senha: string; cidade: string; }
export interface AuthResponse { token: string; }
export interface PerfilUsuario { userId: string; nome: string; email: string; cidade: string; telefone?: string; avatar?: string; biografia?: string; }

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/autenticao`;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(!!localStorage.getItem('authToken'));
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(loginData: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, loginData).pipe(
      tap(response => {
        localStorage.setItem('authToken', response.token);
        this.isAuthenticatedSubject.next(true);
      })
    );
  }

  cadastro(cadastroData: CadastroRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/cadastro`, cadastroData);
  }

  signOut(): void {
    localStorage.removeItem('authToken');
    this.isAuthenticatedSubject.next(false);
  }

  signIn(email: string, senha: string): Observable<any> {
    return this.login({ email, senha });
  }

  checkInitialAuthStatus(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  getPerfil(): Observable<PerfilUsuario> {
    return this.http.get<PerfilUsuario>(`${environment.apiUrl}/Perfil`);
  }

  updatePerfil(perfilAtualizado: Partial<PerfilUsuario>): Observable<any> {
    return this.http.put(`${environment.apiUrl}/Perfil`, perfilAtualizado);
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

  confirmCityChange(token: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/confirmar-cidade`, { token });
  }

  confirmPasswordChange(token: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/confirmar-senha`, { token });
  }
}
