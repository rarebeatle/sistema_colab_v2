import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { InventarioComponent } from './list/inventario.component';
import { InventarioDetailComponent } from './detail/inventario-detail.component';
import { InventarioUpdateComponent } from './update/inventario-update.component';
import InventarioResolve from './route/inventario-routing-resolve.service';

const inventarioRoute: Routes = [
  {
    path: '',
    component: InventarioComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: InventarioDetailComponent,
    resolve: {
      inventario: InventarioResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: InventarioUpdateComponent,
    resolve: {
      inventario: InventarioResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: InventarioUpdateComponent,
    resolve: {
      inventario: InventarioResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default inventarioRoute;
