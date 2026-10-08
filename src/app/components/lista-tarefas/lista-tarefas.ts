import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

import {
  StatusTarefa,
  TarefaModel
} from '../../models/tarefa.model';

import { TarefaService } from '../../services/tarefa.service';

@Component({
  selector: 'app-lista-tarefas',
  imports: [DatePipe],
  templateUrl: './lista-tarefas.html',
  styleUrl: './lista-tarefas.css'
})
export class ListaTarefas implements OnInit {
  private readonly tarefaService = inject(TarefaService);
  private readonly router = inject(Router);

  tarefasPendentes = signal<TarefaModel[]>([]);
  tarefasConcluidas = signal<TarefaModel[]>([]);

  mensagemSucesso = signal('');
  mensagemErro = signal('');

  usuarioId = '';

  ngOnInit(): void {
    const usuarioIdSalvo = localStorage.getItem('usuarioId');

    if (!usuarioIdSalvo) {
      this.mensagemErro.set(
        'Usuário não identificado. Cadastre um usuário antes de acessar as tarefas.'
      );
      return;
    }

    this.usuarioId = usuarioIdSalvo;

    this.carregarTarefas();
  }

  carregarTarefas(): void {
    this.mensagemErro.set('');

    this.tarefaService.listar(this.usuarioId).subscribe({
      next: (tarefas) => {
        this.tarefasPendentes.set(
          tarefas.filter(
            (tarefa) => tarefa.status === StatusTarefa.Pendente
          )
        );

        this.tarefasConcluidas.set(
          tarefas.filter(
            (tarefa) => tarefa.status === StatusTarefa.Concluida
          )
        );
      },

      error: (erro) => {
        this.mensagemErro.set(
          erro.error?.message ?? 'Não foi possível carregar as tarefas.'
        );
      }
    });
  }

  editar(id: string | undefined): void {
    if (!id) {
      return;
    }

    this.router.navigate(['/tarefas/editar', id]);
  }

  concluir(id: string | undefined): void {
    if (!id) {
      return;
    }

    this.mensagemSucesso.set('');
    this.mensagemErro.set('');

    this.tarefaService.concluir(this.usuarioId, id).subscribe({
      next: () => {
        this.mensagemSucesso.set('Tarefa concluída com sucesso.');
        this.carregarTarefas();
      },

      error: (erro) => {
        this.mensagemErro.set(
          erro.error?.message ?? 'Não foi possível concluir a tarefa.'
        );
      }
    });
  }

  excluir(id: string | undefined): void {
    if (!id) {
      return;
    }

    this.mensagemSucesso.set('');
    this.mensagemErro.set('');

    this.tarefaService.excluir(this.usuarioId, id).subscribe({
      next: () => {
        this.mensagemSucesso.set('Tarefa excluída com sucesso.');
        this.carregarTarefas();
      },

      error: (erro) => {
        this.mensagemErro.set(
          erro.error?.message ?? 'Não foi possível excluir a tarefa.'
        );
      }
    });
  }

  novaTarefa(): void {
  this.router.navigate(['/tarefas/nova']);
}
}