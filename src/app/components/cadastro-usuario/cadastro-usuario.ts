import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-cadastro-usuario',
  imports: [ReactiveFormsModule],
  templateUrl: './cadastro-usuario.html',
  styleUrl: './cadastro-usuario.css'
})
export class CadastroUsuario {
  private readonly formBuilder = inject(FormBuilder);
  private readonly usuarioService = inject(UsuarioService);

  mensagemSucesso = signal('');
  mensagemErro = signal('');

  formulario = this.formBuilder.nonNullable.group({
    nome: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)
      ]
    ],
    email: [
      '',
      [
        Validators.required,
        Validators.email
      ]
    ],
    senha: [
      '',
      [
        Validators.required,
        Validators.minLength(8)
      ]
    ]
  });

  cadastrar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.mensagemSucesso.set('');
    this.mensagemErro.set('');

    this.usuarioService.cadastrar(this.formulario.getRawValue()).subscribe({
      next: (usuario) => {
        if (usuario.id) {
          localStorage.setItem('usuarioId', usuario.id);
        }

        this.mensagemSucesso.set('Usuário cadastrado com sucesso.');
        this.formulario.reset();
      },

      error: (erro) => {

        this.mensagemErro.set(
          erro.error?.message ?? 'Não foi possível realizar o cadastro.'
        );
      }
    });
  }
}