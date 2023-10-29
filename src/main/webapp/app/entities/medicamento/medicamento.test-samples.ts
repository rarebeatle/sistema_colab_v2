import { IMedicamento, NewMedicamento } from './medicamento.model';

export const sampleWithRequiredData: IMedicamento = {
  id: 816,
  nombre: 'zesty',
  precio: 26441.42,
};

export const sampleWithPartialData: IMedicamento = {
  id: 15319,
  nombre: 'as',
  precio: 10112.38,
};

export const sampleWithFullData: IMedicamento = {
  id: 20724,
  nombre: 'surprisingly',
  descripcion: 'obesity arrogance',
  precio: 1622.92,
};

export const sampleWithNewData: NewMedicamento = {
  nombre: 'nor muted',
  precio: 8259.98,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
