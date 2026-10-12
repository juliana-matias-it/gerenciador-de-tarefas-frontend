
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  TarefaModel,
  CriarTarefaModel,
  AtualizarTarefaModel
} from '../models/tarefa.model';

@Injectable({
  providedIn: 'root'
})
export class TarefaService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:5161/api/usuarios';

  listar(usuarioId: string): Observable<TarefaModel[]> {
    return this.http.get<TarefaModel[]>(
      `${this.apiUrl}/${usuarioId}/tarefas`,
      { withCredentials: true }
    );
  }

  obterPorId(
    usuarioId: string,
    tarefaId: string
  ): Observable<TarefaModel> {
    return this.http.get<TarefaModel>(
      `${this.apiUrl}/${usuarioId}/tarefas/${tarefaId}`,
      { withCredentials: true }
    );
  }

  criar(
    usuarioId: string,
    dados: CriarTarefaModel
  ): Observable<TarefaModel> {
    return this.http.post<TarefaModel>(
      `${this.apiUrl}/${usuarioId}/tarefas`,
      dados,
      { withCredentials: true }
    );
  }

  atualizar(
    usuarioId: string,
    tarefaId: string,
    dados: AtualizarTarefaModel
  ): Observable<TarefaModel> {
    return this.http.patch<TarefaModel>(
      `${this.apiUrl}/${usuarioId}/tarefas/${tarefaId}`,
      dados,
      { withCredentials: true }
    );
  }

  concluir(
    usuarioId: string,
    tarefaId: string
  ): Observable<void> {
    return this.http.patch<void>(
      `${this.apiUrl}/${usuarioId}/tarefas/${tarefaId}/concluir`,
      {},
      { withCredentials: true }
    );
  }

  excluir(
    usuarioId: string,
    tarefaId: string
  ): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${usuarioId}/tarefas/${tarefaId}`,
      { withCredentials: true }
    );
  }
}
