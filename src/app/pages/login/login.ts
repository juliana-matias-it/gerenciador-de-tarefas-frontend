import { Component, inject, signal } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AutenticacaoService } from '../../services/autenticacao.service';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  mensagem = signal('');

  private readonly router = inject(Router);
  autenticacao = inject(AutenticacaoService);

  formulario = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email,
    ]),
    senha: new FormControl('', [
      Validators.required,
    ]),
  });

  entrar(): void {
    this.mensagem.set('');

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const { email, senha } = this.formulario.getRawValue();

    this.autenticacao.login(email ?? '', senha ?? '').subscribe({
      next: () => {
        void this.router.navigate(['/tarefas']);
      },
      error: erro => {
        this.mensagem.set(
          erro.status === 401
            ? 'E-mail ou senha inválidos.'
            : 'Não foi possível entrar. Tente novamente.'
        );
      },
    });
  }
}