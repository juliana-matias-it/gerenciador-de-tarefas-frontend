import { Routes } from '@angular/router';

import { CadastroUsuario } from './components/cadastro-usuario/cadastro-usuario';
import { ListaTarefas } from './components/lista-tarefas/lista-tarefas';
import { FormularioTarefa } from './components/formulario-tarefa/formulario-tarefa';

export const routes: Routes = [
  {
    path: 'cadastro',
    component: CadastroUsuario
  },
  {
    path: 'tarefas',
    component: ListaTarefas
  },
  {
    path: 'tarefas/nova',
    component: FormularioTarefa
  },
  {
    path: 'tarefas/editar/:id',
    component: FormularioTarefa
  },
  {
    path: '',
    redirectTo: 'cadastro',
    pathMatch: 'full'
  }
];