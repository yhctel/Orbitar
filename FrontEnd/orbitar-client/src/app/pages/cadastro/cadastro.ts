import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LucideAngularModule, Eye, EyeOff, ArrowLeft } from 'lucide-angular';
import { IbgeService } from './../../services/ibge';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    LucideAngularModule // Módulo para ícones
  ],
  templateUrl: './cadastro.html',
  styleUrls: ['./cadastro.css']
})
export class CadastroComponent implements OnInit {
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
  lucideArrowLeft = ArrowLeft; // Ícone de voltar

  constructor(private router: Router, private ibgeService: IbgeService) {}

  ngOnInit(): void {
    this.carregarCidades();
  }

  carregarCidades(): void {
    this.isLoadingCidades = true;
    this.ibgeService.getCidades().subscribe({
      next: (data) => {
        this.cidades = data;
        this.isLoadingCidades = false;
      },
      error: (err) => {
        console.error('Erro ao carregar cidades', err);
        this.isLoadingCidades = false;
        alert('Não foi possível carregar a lista de cidades.');
      }
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
    console.log('Registrando novo usuário...');
    alert('Cadastro realizado com sucesso!');
    this.router.navigate(['/login']);
  }
}
