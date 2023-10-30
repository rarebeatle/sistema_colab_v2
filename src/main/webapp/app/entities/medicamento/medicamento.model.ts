export interface IMedicamento {
  id: number;
  nombre?: string | null;
  descripcion?: string | null;
  precio?: number | null;
}

export type NewMedicamento = Omit<IMedicamento, 'id'> & { id: null };
