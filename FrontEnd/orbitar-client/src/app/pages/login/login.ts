import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LucideAngularModule, ArrowLeft } from 'lucide-angular'; // Ícone de voltar
import { AuthService } from '../../services/auth.services';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    LucideAngularModule // Módulo para usar os ícones
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  email = '';
  password = '';

  // Expõe o ícone para o template HTML
  lucideArrowLeft = ArrowLeft;

  constructor(private authService: AuthService, private router: Router) {}

  handleGoogleSignIn(): void {
    this.authService.signIn();
  }

  handleEmailLogin(): void {
    console.log('Tentativa de login com:', { email: this.email, password: this.password });
    alert('Funcionalidade de login com email/senha a ser implementada.');
  }
}
