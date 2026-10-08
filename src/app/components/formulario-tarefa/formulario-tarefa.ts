import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import {
  StatusTarefa,
  TarefaModel
} from '../../models/tarefa.model';

import { TarefaService } from '../../services/tarefa.service';

@Component({
  selector: 'app-formulario-tarefa',
  imports: [ReactiveFormsModule],
  templateUrl: './formulario-tarefa.html',
  styleUrl: './formulario-tarefa.css'
})
export class FormularioTarefa implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly tarefaService = inject(TarefaService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  modoEdicao = signal(false);
  mensagemErro = signal('');

  usuarioId = '';
  tarefaId = '';

  formulario = this.formBuilder.nonNullable.group({
    titulo: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)
      ]
    ],

    descricao: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(500)
      ]
    ],

    dataDeVencimento: [
      '',
      Validators.required
    ]
  });

  ngOnInit(): void {
    const usuarioIdSalvo = localStorage.getItem('usuarioId');

    if (!usuarioIdSalvo) {
      this.mensagemErro.set(
        'Usuário não identificado. Cadastre um usuário antes de criar tarefas.'
      );
      return;
    }

    this.usuarioId = usuarioIdSalvo;

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.modoEdicao.set(true);
      this.tarefaId = id;

      this.carregarTarefa();
    }
  }

  carregarTarefa(): void {
    this.tarefaService
      .obterPorId(this.usuarioId, this.tarefaId)
      .subscribe({
        next: (tarefa) => {
          this.formulario.patchValue({
            titulo: tarefa.titulo,
            descricao: tarefa.descricao,
            dataDeVencimento: this.formatarDataParaInput(
              tarefa.dataDeVencimento
            )
          });
        },

        error: (erro) => {
          this.mensagemErro.set(
            erro.error?.message ??
              'Não foi possível carregar a tarefa.'
          );
        }
      });
  }

  salvar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.mensagemErro.set('');

    const valores = this.formulario.getRawValue();

    const tarefa: TarefaModel = {
      titulo: valores.titulo,
      descricao: valores.descricao,
      dataDeVencimento: valores.dataDeVencimento,
      status: StatusTarefa.Pendente
    };

    if (this.modoEdicao()) {
      this.atualizar(tarefa);
    } else {
      this.criar(tarefa);
    }
  }

  criar(tarefa: TarefaModel): void {
    this.tarefaService
      .criar(this.usuarioId, tarefa)
      .subscribe({
        next: () => {
          this.router.navigate(['/tarefas']);
        },

        error: (erro) => {
          this.mensagemErro.set(
            erro.error?.message ??
              'Não foi possível criar a tarefa.'
          );
        }
      });
  }

  atualizar(tarefa: TarefaModel): void {
    this.tarefaService
      .atualizar(
        this.usuarioId,
        this.tarefaId,
        tarefa
      )
      .subscribe({
        next: () => {
          this.router.navigate(['/tarefas']);
        },

        error: (erro) => {
          this.mensagemErro.set(
            erro.error?.message ??
              'Não foi possível atualizar a tarefa.'
          );
        }
      });
  }

  cancelar(): void {
    this.router.navigate(['/tarefas']);
  }

  private formatarDataParaInput(data: string): string {
    return data.substring(0, 16);
  }
}