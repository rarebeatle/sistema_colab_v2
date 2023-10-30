import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../medicamento.test-samples';

import { MedicamentoFormService } from './medicamento-form.service';

describe('Medicamento Form Service', () => {
  let service: MedicamentoFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MedicamentoFormService);
  });

  describe('Service methods', () => {
    describe('createMedicamentoFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createMedicamentoFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nombre: expect.any(Object),
            descripcion: expect.any(Object),
            precio: expect.any(Object),
          }),
        );
      });

      it('passing IMedicamento should create a new form with FormGroup', () => {
        const formGroup = service.createMedicamentoFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nombre: expect.any(Object),
            descripcion: expect.any(Object),
            precio: expect.any(Object),
          }),
        );
      });
    });

    describe('getMedicamento', () => {
      it('should return NewMedicamento for default Medicamento initial value', () => {
        const formGroup = service.createMedicamentoFormGroup(sampleWithNewData);

        const medicamento = service.getMedicamento(formGroup) as any;

        expect(medicamento).toMatchObject(sampleWithNewData);
      });

      it('should return NewMedicamento for empty Medicamento initial value', () => {
        const formGroup = service.createMedicamentoFormGroup();

        const medicamento = service.getMedicamento(formGroup) as any;

        expect(medicamento).toMatchObject({});
      });

      it('should return IMedicamento', () => {
        const formGroup = service.createMedicamentoFormGroup(sampleWithRequiredData);

        const medicamento = service.getMedicamento(formGroup) as any;

        expect(medicamento).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IMedicamento should not enable id FormControl', () => {
        const formGroup = service.createMedicamentoFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewMedicamento should disable id FormControl', () => {
        const formGroup = service.createMedicamentoFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
