
export enum StatusTarefa {
  Pendente = 'Pendente',
  Concluida = 'Concluida'
}

export interface TarefaModel {
  id: string;
  titulo: string;
  descricao: string;
  dataDeVencimento: string;
  status: StatusTarefa;
  usuarioId?: string;
}

export interface CriarTarefaModel {
  titulo: string;
  descricao: string;
  dataDeVencimento: string;
}

export type AtualizarTarefaModel = Partial<CriarTarefaModel>;

