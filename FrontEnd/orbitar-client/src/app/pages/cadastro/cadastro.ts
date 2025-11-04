import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NavbarComponent } from '../../shared/navbar/navbar';
import { AuthService } from '../../services/auth.services'; // Removido CadastroRequest daqui
import { IbgeService } from '../../services/ibge';
import { LucideAngularModule, Eye, EyeOff, ArrowLeft } from 'lucide-angular';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    NavbarComponent,
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

    // --- CORREÇÃO AQUI ---
    // Objeto com propriedades em PascalCase para corresponder ao DTO do C#
    const cadastroData: any = {
      NomeCompleto: this.nome, // Usando NomeCompleto
      Email: this.email,
      Senha: this.senha,
      Cidade: this.cidade
    };

    this.authService.cadastro(cadastroData).subscribe({
      next: () => {
        this.loading = false;
        alert('Cadastro realizado com sucesso! Por favor, faça o login.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading = false;
        // Lógica aprimorada para exibir a mensagem de erro do back-end
        let errorMsg = 'Erro ao realizar o cadastro. Tente novamente.';
        if (err.error && Array.isArray(err.error)) {
          // Se o back-end retornar uma lista de erros (como o FluentValidation faz)
          errorMsg = err.error.join('\n');
        } else if (typeof err.error === 'string') {
          // Se for uma única string de erro
          errorMsg = err.error;
        }
        alert(errorMsg);
        console.error('Resposta de erro do back-end:', err);
      }
    });
  }
}
