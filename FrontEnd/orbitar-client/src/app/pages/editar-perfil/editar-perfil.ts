import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../shared/navbar/navbar';
import { AuthService, PerfilUsuario } from '../../services/auth.services'; // Importação correta
import { IbgeService } from '../../services/ibge';

@Component({
  selector: 'app-editar-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './editar-perfil.html',
  styleUrls: ['./editar-perfil.css']
})
export class EditarPerfilComponent implements OnInit {
  loading = false;
  perfil: PerfilUsuario = { userId: '', nome: '', email: '', cidade: '' }; // Inicialização correta

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
    this.authService.getPerfil().subscribe(data => {
      if (data) {
        this.perfil = { ...data };
        this.originalEmail = data.email;
        this.originalCity = data.cidade;
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
    const emailHasChanged = this.perfil.email !== this.originalEmail;
    if (emailHasChanged) {
      this.showPasswordModal = true;
    } else {
      this.saveProfileData();
    }
  }

  confirmPasswordAndSave(): void {
    this.passwordError = '';
    this.authService.checkCurrentPassword(this.currentPassword).subscribe(isCorrect => {
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
    const cityHasChanged = this.perfil.cidade !== this.originalCity;
    const dataToSave: Partial<PerfilUsuario> = { ...this.perfil };
    if (!saveEmail) {
      delete dataToSave.email;
    }

    if (cityHasChanged) {
      this.authService.requestCityChange(this.perfil.cidade).subscribe(() => {
        alert('Para alterar a cidade, verifique seu e-mail e clique no link de confirmação.');
      });
      delete dataToSave.cidade;
    }

    this.authService.updatePerfil(dataToSave).subscribe(() => {
      this.loading = false;
      alert('Perfil atualizado com sucesso!');
      this.router.navigate(['/']);
    });
  }

  handlePasswordChange(): void {
    if (this.newPassword !== this.confirmNewPassword) {
      alert('As novas senhas não coincidem.');
      return;
    }
    this.authService.requestPasswordChange(this.newPassword).subscribe(() => {
      alert('Para confirmar sua nova senha, verifique seu e-mail.');
      this.newPassword = '';
      this.confirmNewPassword = '';
    });
  }

  cancelar(): void {
    this.router.navigate(['/']);
  }
}
