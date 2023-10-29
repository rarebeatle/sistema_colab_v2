import { IInventario, NewInventario } from './inventario.model';

export const sampleWithRequiredData: IInventario = {
  id: 30835,
  cantidadStock: 16239,
};

export const sampleWithPartialData: IInventario = {
  id: 13821,
  cantidadStock: 25492,
};

export const sampleWithFullData: IInventario = {
  id: 25073,
  cantidadStock: 28759,
};

export const sampleWithNewData: NewInventario = {
  cantidadStock: 19660,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
