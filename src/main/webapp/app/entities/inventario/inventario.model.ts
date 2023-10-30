import { IMedicamento } from 'app/entities/medicamento/medicamento.model';

export interface IInventario {
  id: number;
  cantidadStock?: number | null;
  medicamento?: Pick<IMedicamento, 'id'> | null;
}

export type NewInventario = Omit<IInventario, 'id'> & { id: null };
