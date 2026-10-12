import { Routes } from '@angular/router';
import { CadastroUsuario } from './usuario/cadastro';
import { Login } from './pages/login/login';
import { ListaTarefas } from './components/lista-tarefas/lista-tarefas';

export const routes: Routes = [
  { path: 'cadastro', component: CadastroUsuario },
  { path: 'login', component: Login },
  { path: 'tarefas', component: ListaTarefas },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];