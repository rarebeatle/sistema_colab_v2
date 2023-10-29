export interface IInventario {
  id: number;
  cantidadStock?: number | null;
}

export type NewInventario = Omit<IInventario, 'id'> & { id: null };
