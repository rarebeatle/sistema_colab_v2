import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IInventario } from '../inventario.model';
import { InventarioService } from '../service/inventario.service';

export const inventarioResolve = (route: ActivatedRouteSnapshot): Observable<null | IInventario> => {
  const id = route.params['id'];
  if (id) {
    return inject(InventarioService)
      .find(id)
      .pipe(
        mergeMap((inventario: HttpResponse<IInventario>) => {
          if (inventario.body) {
            return of(inventario.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default inventarioResolve;
