import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IInventario, NewInventario } from '../inventario.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IInventario for edit and NewInventarioFormGroupInput for create.
 */
type InventarioFormGroupInput = IInventario | PartialWithRequiredKeyOf<NewInventario>;

type InventarioFormDefaults = Pick<NewInventario, 'id'>;

type InventarioFormGroupContent = {
  id: FormControl<IInventario['id'] | NewInventario['id']>;
  cantidadStock: FormControl<IInventario['cantidadStock']>;
  medicamento: FormControl<IInventario['medicamento']>;
};

export type InventarioFormGroup = FormGroup<InventarioFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class InventarioFormService {
  createInventarioFormGroup(inventario: InventarioFormGroupInput = { id: null }): InventarioFormGroup {
    const inventarioRawValue = {
      ...this.getFormDefaults(),
      ...inventario,
    };
    return new FormGroup<InventarioFormGroupContent>({
      id: new FormControl(
        { value: inventarioRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      cantidadStock: new FormControl(inventarioRawValue.cantidadStock, {
        validators: [Validators.required],
      }),
      medicamento: new FormControl(inventarioRawValue.medicamento),
    });
  }

  getInventario(form: InventarioFormGroup): IInventario | NewInventario {
    return form.getRawValue() as IInventario | NewInventario;
  }

  resetForm(form: InventarioFormGroup, inventario: InventarioFormGroupInput): void {
    const inventarioRawValue = { ...this.getFormDefaults(), ...inventario };
    form.reset(
      {
        ...inventarioRawValue,
        id: { value: inventarioRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): InventarioFormDefaults {
    return {
      id: null,
    };
  }
}
