
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface LoginResponse {
  id: string;
  nome: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class AutenticacaoService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:5161/api/autenticacao';

  usuarioAtual = signal<LoginResponse | null>(null);

  login(email: string, senha: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(
        `${this.apiUrl}/login`,
        { email, senha },
        { withCredentials: true }
      )
      .pipe(
        tap(usuario => this.usuarioAtual.set(usuario))
      );
  }

  logout(): Observable<void> {
    return this.http
      .post<void>(
        `${this.apiUrl}/logout`,
        {},
        { withCredentials: true }
      )
      .pipe(
        tap({
          next: () => this.usuarioAtual.set(null),
          error: () => this.usuarioAtual.set(null)
        })
      );
  }
}
