import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'medicamento',
        data: { pageTitle: 'famarticav2App.medicamento.home.title' },
        loadChildren: () => import('./medicamento/medicamento.routes'),
      },
      {
        path: 'inventario',
        data: { pageTitle: 'famarticav2App.inventario.home.title' },
        loadChildren: () => import('./inventario/inventario.routes'),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
