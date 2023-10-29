import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IMedicamento } from '../medicamento.model';
import { MedicamentoService } from '../service/medicamento.service';

export const medicamentoResolve = (route: ActivatedRouteSnapshot): Observable<null | IMedicamento> => {
  const id = route.params['id'];
  if (id) {
    return inject(MedicamentoService)
      .find(id)
      .pipe(
        mergeMap((medicamento: HttpResponse<IMedicamento>) => {
          if (medicamento.body) {
            return of(medicamento.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default medicamentoResolve;
