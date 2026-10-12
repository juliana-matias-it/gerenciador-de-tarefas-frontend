import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';

import { TarefaModel, StatusTarefa } from '../../models/tarefa.model';
import { TarefaService } from '../../services/tarefa.service';
import { AutenticacaoService } from '../../services/autenticacao.service';

@Component({
  selector: 'app-lista-tarefas',
  standalone: true,
  imports: [DatePipe, RouterLink],
  templateUrl: './lista-tarefas.html',
  styleUrl: './lista-tarefas.css',
})
export class ListaTarefas implements OnInit {
  private readonly tarefaService = inject(TarefaService);
  private readonly autenticacao = inject(AutenticacaoService);
  private readonly router = inject(Router);

  readonly StatusTarefa = StatusTarefa;
  readonly usuario = this.autenticacao.usuarioAtual;
  readonly tarefas = signal<TarefaModel[]>([]);
  readonly mensagem = signal('');
  readonly carregando = signal(false);
  readonly operacaoEmAndamento = signal(false);

  readonly pendentes = computed(() =>
    this.tarefas().filter((tarefa) => tarefa.status === StatusTarefa.Pendente),
  );

  readonly concluidas = computed(() =>
    this.tarefas().filter((tarefa) => tarefa.status === StatusTarefa.Concluida),
  );

  ngOnInit(): void {
    if (!this.usuario()) {
      void this.router.navigate(['/login']);
      return;
    }

    this.carregarTarefas();
  }

  carregarTarefas(): void {
    const usuarioId = this.usuario()?.id;

    if (!usuarioId) {
      return;
    }

    this.carregando.set(true);
    this.mensagem.set('');

    this.tarefaService.listar(usuarioId).subscribe({
      next: (tarefas) => {
        this.tarefas.set(tarefas);
        this.carregando.set(false);
      },
      error: (erro) => {
        this.mensagem.set(this.extrairMensagemErro(erro, 'Não foi possível carregar as tarefas.'));
        this.carregando.set(false);
      },
    });
  }

  concluir(tarefa: TarefaModel): void {
    const usuarioId = this.usuario()?.id;

    if (
      !usuarioId ||
      !tarefa.id ||
      tarefa.status === StatusTarefa.Concluida ||
      this.operacaoEmAndamento()
    ) {
      return;
    }

    this.mensagem.set('');
    this.operacaoEmAndamento.set(true);

    this.tarefaService.concluir(usuarioId, tarefa.id).subscribe({
      next: () => {
        this.operacaoEmAndamento.set(false);
        this.carregarTarefas();
      },
      error: (erro) => {
        this.mensagem.set(this.extrairMensagemErro(erro, 'Não foi possível concluir a tarefa.'));
        this.operacaoEmAndamento.set(false);
      },
    });
  }

  excluir(tarefa: TarefaModel): void {
    const usuarioId = this.usuario()?.id;

    if (!usuarioId || !tarefa.id || this.operacaoEmAndamento()) {
      return;
    }

    if (!window.confirm(`Excluir a tarefa "${tarefa.titulo}"?`)) {
      return;
    }

    this.mensagem.set('');
    this.operacaoEmAndamento.set(true);

    this.tarefaService.excluir(usuarioId, tarefa.id).subscribe({
      next: () => {
        this.operacaoEmAndamento.set(false);
        this.carregarTarefas();
      },
      error: (erro) => {
        this.mensagem.set(this.extrairMensagemErro(erro, 'Não foi possível excluir a tarefa.'));
        this.operacaoEmAndamento.set(false);
      },
    });
  }

  sair(): void {
    this.autenticacao.logout().subscribe({
      next: () => {
        void this.router.navigateByUrl('/login');
      },
      error: () => {
        void this.router.navigateByUrl('/login');
      },
    });
  }

  private extrairMensagemErro(erro: HttpErrorResponse, mensagemPadrao: string): string {
    const corpo: unknown = erro.error;

    if (typeof corpo === 'string' && corpo.trim()) {
      return corpo;
    }

    if (corpo && typeof corpo === 'object') {
      const dados = corpo as Record<string, unknown>;

      for (const campo of ['message', 'detail', 'title']) {
        const valor = dados[campo];

        if (typeof valor === 'string' && valor.trim()) {
          return valor;
        }
      }

      const erros = dados['errors'];

      if (erros && typeof erros === 'object') {
        const mensagens = Object.values(erros as Record<string, unknown>)
          .flatMap((valor) => (Array.isArray(valor) ? valor : [valor]))
          .filter((valor): valor is string => typeof valor === 'string');

        if (mensagens.length > 0) {
          return mensagens.join(' ');
        }
      }
    }

    switch (erro.status) {
      case 401:
        return 'Sua sessão expirou. Entre novamente.';
      case 403:
        return 'Você não tem permissão para realizar esta operação.';
      case 404:
        return 'A tarefa solicitada não foi encontrada.';
      case 409:
        return 'Não foi possível realizar a operação devido a um conflito.';
      case 500:
        return 'Ocorreu um erro interno no servidor.';
      default:
        return mensagemPadrao;
    }
  }
}
