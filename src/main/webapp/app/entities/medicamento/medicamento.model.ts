import { IInventario } from 'app/entities/inventario/inventario.model';

export interface IMedicamento {
  id: number;
  nombre?: string | null;
  descripcion?: string | null;
  precio?: number | null;
  inventario?: Pick<IInventario, 'id'> | null;
}

export type NewMedicamento = Omit<IMedicamento, 'id'> & { id: null };
