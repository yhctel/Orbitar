// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';
import { LoginComponent } from './pages/login/login';
import { CadastroComponent } from './pages/cadastro/cadastro';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'cadastro', component: CadastroComponent },
];
