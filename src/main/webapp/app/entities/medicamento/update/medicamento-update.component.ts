import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IInventario } from 'app/entities/inventario/inventario.model';
import { InventarioService } from 'app/entities/inventario/service/inventario.service';
import { IMedicamento } from '../medicamento.model';
import { MedicamentoService } from '../service/medicamento.service';
import { MedicamentoFormService, MedicamentoFormGroup } from './medicamento-form.service';

@Component({
  standalone: true,
  selector: 'jhi-medicamento-update',
  templateUrl: './medicamento-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class MedicamentoUpdateComponent implements OnInit {
  isSaving = false;
  medicamento: IMedicamento | null = null;

  inventariosCollection: IInventario[] = [];

  editForm: MedicamentoFormGroup = this.medicamentoFormService.createMedicamentoFormGroup();

  constructor(
    protected medicamentoService: MedicamentoService,
    protected medicamentoFormService: MedicamentoFormService,
    protected inventarioService: InventarioService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  compareInventario = (o1: IInventario | null, o2: IInventario | null): boolean => this.inventarioService.compareInventario(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ medicamento }) => {
      this.medicamento = medicamento;
      if (medicamento) {
        this.updateForm(medicamento);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const medicamento = this.medicamentoFormService.getMedicamento(this.editForm);
    if (medicamento.id !== null) {
      this.subscribeToSaveResponse(this.medicamentoService.update(medicamento));
    } else {
      this.subscribeToSaveResponse(this.medicamentoService.create(medicamento));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMedicamento>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(medicamento: IMedicamento): void {
    this.medicamento = medicamento;
    this.medicamentoFormService.resetForm(this.editForm, medicamento);

    this.inventariosCollection = this.inventarioService.addInventarioToCollectionIfMissing<IInventario>(
      this.inventariosCollection,
      medicamento.inventario,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.inventarioService
      .query({ filter: 'medicamento-is-null' })
      .pipe(map((res: HttpResponse<IInventario[]>) => res.body ?? []))
      .pipe(
        map((inventarios: IInventario[]) =>
          this.inventarioService.addInventarioToCollectionIfMissing<IInventario>(inventarios, this.medicamento?.inventario),
        ),
      )
      .subscribe((inventarios: IInventario[]) => (this.inventariosCollection = inventarios));
  }
}
