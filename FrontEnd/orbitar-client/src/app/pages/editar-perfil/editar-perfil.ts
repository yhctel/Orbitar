import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../shared/navbar/navbar';
import { AuthService, PerfilUsuario } from '../../services/auth.service';
import { IbgeService } from '../../services/ibge.service';

@Component({
  selector: 'app-editar-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './editar-perfil.html',
  styleUrls: ['./editar-perfil.css']
})
export class EditarPerfilComponent implements OnInit {
  loading = true;
  formData: PerfilUsuario = { userId: '', nome: '', email: '', cidade: '', telefone: '', biografia: '' };

  originalEmail = '';
  originalCity = '';

  showPasswordModal = false;
  currentPassword = '';
  passwordError = '';

  newPassword = '';
  confirmNewPassword = '';

  cidades: string[] = [];
  isLoadingCidades = false;

  constructor(
    private authService: AuthService,
    private ibgeService: IbgeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.getPerfil().subscribe({
      next: (data: PerfilUsuario) => {
        if (data) {
          this.formData = data;
          this.originalEmail = data.email;
          this.originalCity = data.cidade;
        }
        this.loading = false;
      },

      error: (err) => {
        console.error('Falha ao buscar perfil:', err);
        this.loading = false;
        if (err.status === 401) {
          alert('Sua sessão expirou. Por favor, faça login novamente.');
          this.authService.signOut();
        } else {
          alert('Não foi possível carregar os dados do seu perfil.');
        }
      }
    });
    this.carregarCidades();
  }

  carregarCidades(): void {
    this.isLoadingCidades = true;
    this.ibgeService.getCidades().subscribe(data => {
      this.cidades = data;
      this.isLoadingCidades = false;
    });
  }

  handleSubmit(): void {
    const emailHasChanged = this.formData.email !== this.originalEmail;
    if (emailHasChanged) {
      this.showPasswordModal = true;
    } else {
      this.saveProfileData();
    }
  }

  confirmPasswordAndSave(): void {
    this.passwordError = '';
    this.authService.checkCurrentPassword(this.currentPassword).subscribe((isCorrect: boolean) => {
      if (isCorrect) {
        this.showPasswordModal = false;
        this.saveProfileData(true);
      } else {
        this.passwordError = 'Senha incorreta. Tente novamente.';
      }
    });
  }

  saveProfileData(saveEmail = false): void {
    this.loading = true;
    const cityHasChanged = this.formData.cidade !== this.originalCity;
    const dataToSave: Partial<PerfilUsuario> = { ...this.formData };

    if (!saveEmail) {
      delete dataToSave.email;
    }

    if (cityHasChanged) {
      this.authService.requestCityChange(this.formData.cidade).subscribe(() => {
        alert('Para alterar a cidade, verifique seu e-mail e clique no link de confirmação.');
      });
      delete dataToSave.cidade;
    }

    this.authService.updatePerfil(dataToSave).subscribe({
      next: () => {
        this.loading = false;
        alert('Perfil atualizado com sucesso!');
        this.router.navigate(['/perfil']);
      },
      error: (err) => {
        this.loading = false;
        alert('Ocorreu um erro ao atualizar o perfil.');
        console.error(err);
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/']);
  }
}
