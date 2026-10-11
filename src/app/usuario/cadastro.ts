import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioService } from '../services/usuario.service';

@Component({
  selector: 'app-cadastro-usuario',
  imports: [ReactiveFormsModule],
  templateUrl: './usuario.html',
  styleUrl: './usuario.css',
})
export class CadastroUsuario {
  private fb = inject(FormBuilder);
  private usuarioService = inject(UsuarioService);

  mensagem = signal('');
  erro = signal(false);

  form = this.fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(100)]],
  });

  cadastrar() {
    this.usuarioService.cadastrar(this.form.getRawValue()).subscribe({
      next: () => {
        this.erro.set(false);
        this.mensagem.set('Usuário cadastrado com sucesso!');
        this.form.reset();
      },
      error: (e) => {
        this.erro.set(true);
        this.mensagem.set(
          e.status === 409 ? 'Já existe um usuário com esse e-mail.' : 'Erro ao cadastrar usuário.'
        );
      },
    });
  }
}