import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../inventario.test-samples';

import { InventarioFormService } from './inventario-form.service';

describe('Inventario Form Service', () => {
  let service: InventarioFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InventarioFormService);
  });

  describe('Service methods', () => {
    describe('createInventarioFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createInventarioFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            cantidadStock: expect.any(Object),
          }),
        );
      });

      it('passing IInventario should create a new form with FormGroup', () => {
        const formGroup = service.createInventarioFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            cantidadStock: expect.any(Object),
          }),
        );
      });
    });

    describe('getInventario', () => {
      it('should return NewInventario for default Inventario initial value', () => {
        const formGroup = service.createInventarioFormGroup(sampleWithNewData);

        const inventario = service.getInventario(formGroup) as any;

        expect(inventario).toMatchObject(sampleWithNewData);
      });

      it('should return NewInventario for empty Inventario initial value', () => {
        const formGroup = service.createInventarioFormGroup();

        const inventario = service.getInventario(formGroup) as any;

        expect(inventario).toMatchObject({});
      });

      it('should return IInventario', () => {
        const formGroup = service.createInventarioFormGroup(sampleWithRequiredData);

        const inventario = service.getInventario(formGroup) as any;

        expect(inventario).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IInventario should not enable id FormControl', () => {
        const formGroup = service.createInventarioFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewInventario should disable id FormControl', () => {
        const formGroup = service.createInventarioFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
