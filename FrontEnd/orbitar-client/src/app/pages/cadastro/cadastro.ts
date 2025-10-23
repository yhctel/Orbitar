import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NavbarComponent } from '../../shared/navbar/navbar';
import { AuthService, CadastroRequest } from '../../services/auth.services';
import { IbgeService } from '../../services/ibge';
import { LucideAngularModule, Eye, EyeOff, ArrowLeft } from 'lucide-angular';

@Component({
  selector: 'app-cadastrro',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    LucideAngularModule
],
  templateUrl: './cadastro.html',
  styleUrls: ['./cadastro.css']
})
export class CadastroComponent implements OnInit {
  loading = false;
  nome = '';
  email = '';
  senha = '';
  confirmarSenha = '';
  cidade = '';

  cidades: string[] = [];
  isLoadingCidades = false;

  passwordVisible = false;
  passwordFieldType = 'password';

  lucideEye = Eye;
  lucideEyeOff = EyeOff;
  lucideArrowLeft = ArrowLeft;

  constructor(
    private authService: AuthService,
    private ibgeService: IbgeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarCidades();
  }

  carregarCidades(): void {
    this.isLoadingCidades = true;
    this.ibgeService.getCidades().subscribe(data => {
      this.cidades = data;
      this.isLoadingCidades = false;
    });
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
    this.passwordFieldType = this.passwordVisible ? 'text' : 'password';
  }

  handleCadastro(): void {
    if (!this.nome || !this.email || !this.senha || !this.cidade) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    if (this.senha !== this.confirmarSenha) {
      alert('As senhas não coincidem!');
      return;
    }

    this.loading = true;
    const cadastroData: CadastroRequest = {
      nome: this.nome,
      email: this.email,
      senha: this.senha,
      cidade: this.cidade
    };

    this.authService.cadastro(cadastroData).subscribe({
      next: () => {
        this.loading = false;
        alert('Cadastro realizado com sucesso! Faça o login.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading = false;
        alert('Erro ao realizar o cadastro. Verifique os dados.');
        console.error(err);
      }
    });
  }
}
