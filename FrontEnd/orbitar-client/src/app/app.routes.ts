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

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'catalogo', component: CatalogoComponent },
  { path: 'doar', component: CadastrarProdutoComponent },
  { path: 'login', component: LoginComponent },
  { path: 'cadastro', component: CadastroComponent },
  { path: 'minhas-doacoes', component: MinhasDoacoesComponent},
  { path: 'perfil', component: EditarPerfilComponent },
  { path: 'confirmar-cidade', component: ConfirmarCidadeComponent },
  { path: 'confirmar-senha', component: ConfirmarSenhaComponent },
  { path: 'notificacoes', component: NotificacoesComponent },
];
