import { Routes } from '@angular/router';
import { CadastroUsuario } from './usuario/cadastro';

export const routes: Routes = [
  { path: '', component: CadastroUsuario },
  { path: 'cadastro', component: CadastroUsuario },
];