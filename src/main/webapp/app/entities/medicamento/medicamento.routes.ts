import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { MedicamentoComponent } from './list/medicamento.component';
import { MedicamentoDetailComponent } from './detail/medicamento-detail.component';
import { MedicamentoUpdateComponent } from './update/medicamento-update.component';
import MedicamentoResolve from './route/medicamento-routing-resolve.service';

const medicamentoRoute: Routes = [
  {
    path: '',
    component: MedicamentoComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: MedicamentoDetailComponent,
    resolve: {
      medicamento: MedicamentoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: MedicamentoUpdateComponent,
    resolve: {
      medicamento: MedicamentoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: MedicamentoUpdateComponent,
    resolve: {
      medicamento: MedicamentoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default medicamentoRoute;
