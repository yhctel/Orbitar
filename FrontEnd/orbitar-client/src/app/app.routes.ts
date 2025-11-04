// Local: src/app/app.routes.ts

import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';
import { LoginComponent } from './pages/login/login';
import { CadastroComponent } from './pages/cadastro/cadastro';
import { CatalogoComponent } from './pages/catalogo/catalogo';
import { CadastrarProdutoComponent } from './pages/cadastrar-produto/cadastrar-produto';
import { MinhasDoacoesComponent } from './pages/minhas-doacoes/minhas-doacoes';
import { EditarPerfilComponent } from './pages/editar-perfil/editar-perfil';
import { ConfirmarCidadeComponent } from './pages/confirmar-cidade/confirmar-cidade';
import { ConfirmarSenhaComponent } from './pages/confirmar-senha/confirmar-senha';
import { NotificacoesComponent } from './pages/notificacoes/notificacoes';
import { ReservasComponent } from './pages/reserva/reserva';

import { authGuard } from './guards/auth.guard';
export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'cadastro', component: CadastroComponent },
  { path: 'confirmar-cidade', component: ConfirmarCidadeComponent },
  { path: 'confirmar-senha', component: ConfirmarSenhaComponent },
  { path: 'catalogo', component: CatalogoComponent, canActivate: [authGuard] },
  { path: 'doar', component: CadastrarProdutoComponent, canActivate: [authGuard] },
  { path: 'minhas-doacoes', component: MinhasDoacoesComponent, canActivate: [authGuard] },
  { path: 'perfil', component: EditarPerfilComponent, canActivate: [authGuard] },
  { path: 'notificacoes', component: NotificacoesComponent, canActivate: [authGuard] },
  { path: 'reserva', component: ReservasComponent, canActivate: [authGuard] },
];
