import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LoginResponse {
  id: string;
  nome: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class AutenticacaoService {
  private http = inject(HttpClient);

  login(email: string, senha: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      'http://localhost:5161/api/autenticacao/login',
      { email, senha },
      { withCredentials: true },
    );
  }
}