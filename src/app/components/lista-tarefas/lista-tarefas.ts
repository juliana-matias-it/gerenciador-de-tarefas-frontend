import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { TarefaModel, StatusTarefa } from '../../models/tarefa.model';
import { TarefaService } from '../../services/tarefa.service';
import { AutenticacaoService } from '../../services/autenticacao.service';

@Component({
  imports: [DatePipe, RouterLink],
  selector: 'app-lista-tarefas',
  styleUrl: './lista-tarefas.css',
  templateUrl: './lista-tarefas.html',
})
export class ListaTarefas implements OnInit {
  private readonly tarefaService = inject(TarefaService);
  private readonly autenticacao = inject(AutenticacaoService);
  private readonly router = inject(Router);

  readonly usuario = this.autenticacao.usuarioAtual;
  readonly tarefas = signal<TarefaModel[]>([]);
  readonly mensagem = signal('');
  readonly carregando = signal(false);
  readonly operacaoEmAndamento = signal(false);

  readonly pendentes = computed(() =>
    this.tarefas().filter(tarefa => tarefa.status === StatusTarefa.Pendente)
  );

  readonly concluidas = computed(() =>
    this.tarefas().filter(tarefa => tarefa.status === StatusTarefa.Concluida)
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

    if (!usuarioId) return;

    this.carregando.set(true);

    this.tarefaService.listar(usuarioId).subscribe({
      next: tarefas => {
        this.tarefas.set(tarefas);
        this.carregando.set(false);
      },
      error: () => {
        this.mensagem.set('Não foi possível carregar as tarefas.');
        this.carregando.set(false);
      },
    });
  }

  concluir(tarefa: TarefaModel): void {
    const usuarioId = this.usuario()?.id;

    if (!usuarioId || !tarefa.id || this.operacaoEmAndamento()) return;

    this.mensagem.set('');
    this.operacaoEmAndamento.set(true);

    this.tarefaService.concluir(usuarioId, tarefa.id).subscribe({
      next: () => {
        this.mensagem.set('Tarefa concluída com sucesso.');
        this.operacaoEmAndamento.set(false);
        this.carregarTarefas();
      },
      error: () => {
        this.mensagem.set('Não foi possível concluir a tarefa.');
        this.operacaoEmAndamento.set(false);
      },
    });
  }

  excluir(tarefa: TarefaModel): void {
    const usuarioId = this.usuario()?.id;

    if (!usuarioId || !tarefa.id || this.operacaoEmAndamento()) return;

    if (!window.confirm(`Excluir a tarefa "${tarefa.titulo}"?`)) return;

    this.mensagem.set('');
    this.operacaoEmAndamento.set(true);

    this.tarefaService.excluir(usuarioId, tarefa.id).subscribe({
      next: () => {
        this.mensagem.set('Tarefa excluída com sucesso.');
        this.operacaoEmAndamento.set(false);
        this.carregarTarefas();
      },
      error: () => {
        this.mensagem.set('Não foi possível excluir a tarefa.');
        this.operacaoEmAndamento.set(false);
      },
    });
  }
}