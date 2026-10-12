import { Routes } from '@angular/router';
import { CadastroUsuario } from './usuario/cadastro';
import { Login } from './pages/login/login';

export const routes: Routes = [
  { path: '', component: CadastroUsuario },
  { path: 'cadastro', component: CadastroUsuario },
  { path: 'login', component: Login },
];
