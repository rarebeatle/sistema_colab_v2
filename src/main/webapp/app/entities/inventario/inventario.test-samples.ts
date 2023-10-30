import { IInventario, NewInventario } from './inventario.model';

export const sampleWithRequiredData: IInventario = {
  id: 16136,
  cantidadStock: 22402,
};

export const sampleWithPartialData: IInventario = {
  id: 12360,
  cantidadStock: 30835,
};

export const sampleWithFullData: IInventario = {
  id: 16239,
  cantidadStock: 13821,
};

export const sampleWithNewData: NewInventario = {
  cantidadStock: 25492,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
