import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import {
  AtualizarTarefaModel,
  CriarTarefaModel,
  StatusTarefa,
  TarefaModel,
} from '../../models/tarefa.model';
import { TarefaService } from '../../services/tarefa.service';
import { AutenticacaoService } from '../../services/autenticacao.service';

@Component({
  selector: 'app-formulario-tarefa',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './formulario-tarefa.html',
  styleUrl: './formulario-tarefa.css',
})
export class FormularioTarefa implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly tarefaService = inject(TarefaService);
  private readonly autenticacao = inject(AutenticacaoService);

  readonly StatusTarefa = StatusTarefa;
  readonly dataAtual = FormularioTarefa.obterDataAtual();

  tarefa: TarefaModel | null = null;
  editando = false;
  carregando = false;
  salvando = false;
  mensagem = '';

  readonly formulario = this.fb.nonNullable.group({
    titulo: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    descricao: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(500)]],
    dataDeVencimento: ['', [Validators.required, FormularioTarefa.validarDataDeVencimento]],
  });

  ngOnInit(): void {
    const usuarioId = this.autenticacao.usuarioAtual()?.id;

    if (!usuarioId) {
      void this.router.navigateByUrl('/login');
      return;
    }

    this.route.paramMap.subscribe({
      next: (params) => {
        const tarefaId = params.get('id');

        this.editando = tarefaId !== null;
        this.tarefa = null;
        this.mensagem = '';
        this.carregando = false;
        this.salvando = false;

        this.formulario.reset({
          titulo: '',
          descricao: '',
          dataDeVencimento: '',
        });

        if (!tarefaId) {
          return;
        }

        this.carregando = true;

        this.tarefaService.obterPorId(usuarioId, tarefaId).subscribe({
          next: (tarefa) => {
            this.tarefa = tarefa;
            this.carregando = false;

            if (tarefa.status === StatusTarefa.Concluida) {
              this.mensagem = 'Não é possível editar uma tarefa concluída.';
              return;
            }

            this.formulario.reset({
              titulo: tarefa.titulo,
              descricao: tarefa.descricao,
              dataDeVencimento: tarefa.dataDeVencimento.slice(0, 10),
            });
          },
          error: (erro: HttpErrorResponse) => {
            this.mensagem = this.extrairMensagemErro(erro, 'Não foi possível carregar a tarefa.');
            this.carregando = false;
          },
        });
      },
    });
  }

  enviarFormulario(): void {
    if (this.formulario.invalid || this.salvando || this.carregando) {
      this.formulario.markAllAsTouched();
      return;
    }

    if (this.tarefa?.status === StatusTarefa.Concluida) {
      this.mensagem = 'Não é possível editar uma tarefa concluída.';
      return;
    }

    const usuarioId = this.autenticacao.usuarioAtual()?.id;

    if (!usuarioId) {
      void this.router.navigateByUrl('/login');
      return;
    }

    const dados = this.formulario.getRawValue();

    this.mensagem = '';
    this.salvando = true;

    if (this.editando && this.tarefa) {
      const atualizacao: AtualizarTarefaModel = {};

      if (dados.titulo !== this.tarefa.titulo) {
        atualizacao.titulo = dados.titulo;
      }

      if (dados.descricao !== this.tarefa.descricao) {
        atualizacao.descricao = dados.descricao;
      }

      if (dados.dataDeVencimento !== this.tarefa.dataDeVencimento.slice(0, 10)) {
        atualizacao.dataDeVencimento = dados.dataDeVencimento;
      }

      if (Object.keys(atualizacao).length === 0) {
        this.salvando = false;
        void this.router.navigateByUrl('/tarefas');
        return;
      }

      this.tarefaService.atualizar(usuarioId, this.tarefa.id, atualizacao).subscribe({
        next: () => {
          void this.router.navigateByUrl('/tarefas');
        },
        error: (erro: HttpErrorResponse) => {
          this.mensagem = this.extrairMensagemErro(erro, 'Não foi possível atualizar a tarefa.');
          this.salvando = false;
        },
      });

      return;
    }

    const novaTarefa: CriarTarefaModel = {
      titulo: dados.titulo,
      descricao: dados.descricao,
      dataDeVencimento: dados.dataDeVencimento,
    };

    this.tarefaService.criar(usuarioId, novaTarefa).subscribe({
      next: () => {
        void this.router.navigateByUrl('/tarefas');
      },
      error: (erro: HttpErrorResponse) => {
        this.mensagem = this.extrairMensagemErro(erro, 'Não foi possível cadastrar a tarefa.');
        this.salvando = false;
      },
    });
  }

  cancelar(): void {
    void this.router.navigateByUrl('/tarefas');
  }

  private static validarDataDeVencimento(control: AbstractControl): ValidationErrors | null {
    const data = control.value as string;

    if (!data) {
      return null;
    }

    return data < FormularioTarefa.obterDataAtual() ? { dataAnterior: true } : null;
  }

  private static obterDataAtual(): string {
    const agora = new Date();
    const ano = agora.getFullYear();
    const mes = String(agora.getMonth() + 1).padStart(2, '0');
    const dia = String(agora.getDate()).padStart(2, '0');

    return `${ano}-${mes}-${dia}`;
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
      case 400:
        return 'Os dados enviados são inválidos.';
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
