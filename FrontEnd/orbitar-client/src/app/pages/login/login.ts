import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LucideAngularModule, ArrowLeft } from 'lucide-angular';
import { AuthService, LoginRequest } from '../../services/auth.services';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    LucideAngularModule
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  email = '';
  password = '';
  lucideArrowLeft = ArrowLeft;

  constructor(private authService: AuthService, private router: Router) {}

  handleEmailLogin(): void {
    const loginData: LoginRequest = { email: this.email, senha: this.password };
    this.authService.login(loginData).subscribe({
      next: () => {
        this.router.navigate(['/catalogo']);
      },
      error: (err) => {
        alert('Email ou senha inválidos.');
        console.error(err);
      }
    });
  }
}
