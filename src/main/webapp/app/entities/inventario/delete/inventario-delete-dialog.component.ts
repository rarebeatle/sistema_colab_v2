import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IInventario } from '../inventario.model';
import { InventarioService } from '../service/inventario.service';

@Component({
  standalone: true,
  templateUrl: './inventario-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class InventarioDeleteDialogComponent {
  inventario?: IInventario;

  constructor(
    protected inventarioService: InventarioService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.inventarioService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
