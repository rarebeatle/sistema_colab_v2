import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IInventario } from '../inventario.model';
import { InventarioService } from '../service/inventario.service';
import { InventarioFormService, InventarioFormGroup } from './inventario-form.service';

@Component({
  standalone: true,
  selector: 'jhi-inventario-update',
  templateUrl: './inventario-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class InventarioUpdateComponent implements OnInit {
  isSaving = false;
  inventario: IInventario | null = null;

  editForm: InventarioFormGroup = this.inventarioFormService.createInventarioFormGroup();

  constructor(
    protected inventarioService: InventarioService,
    protected inventarioFormService: InventarioFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ inventario }) => {
      this.inventario = inventario;
      if (inventario) {
        this.updateForm(inventario);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const inventario = this.inventarioFormService.getInventario(this.editForm);
    if (inventario.id !== null) {
      this.subscribeToSaveResponse(this.inventarioService.update(inventario));
    } else {
      this.subscribeToSaveResponse(this.inventarioService.create(inventario));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IInventario>>): void {
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

  protected updateForm(inventario: IInventario): void {
    this.inventario = inventario;
    this.inventarioFormService.resetForm(this.editForm, inventario);
  }
}
