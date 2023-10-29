import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IInventario, NewInventario } from '../inventario.model';

export type PartialUpdateInventario = Partial<IInventario> & Pick<IInventario, 'id'>;

export type EntityResponseType = HttpResponse<IInventario>;
export type EntityArrayResponseType = HttpResponse<IInventario[]>;

@Injectable({ providedIn: 'root' })
export class InventarioService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/inventarios');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(inventario: NewInventario): Observable<EntityResponseType> {
    return this.http.post<IInventario>(this.resourceUrl, inventario, { observe: 'response' });
  }

  update(inventario: IInventario): Observable<EntityResponseType> {
    return this.http.put<IInventario>(`${this.resourceUrl}/${this.getInventarioIdentifier(inventario)}`, inventario, {
      observe: 'response',
    });
  }

  partialUpdate(inventario: PartialUpdateInventario): Observable<EntityResponseType> {
    return this.http.patch<IInventario>(`${this.resourceUrl}/${this.getInventarioIdentifier(inventario)}`, inventario, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IInventario>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IInventario[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getInventarioIdentifier(inventario: Pick<IInventario, 'id'>): number {
    return inventario.id;
  }

  compareInventario(o1: Pick<IInventario, 'id'> | null, o2: Pick<IInventario, 'id'> | null): boolean {
    return o1 && o2 ? this.getInventarioIdentifier(o1) === this.getInventarioIdentifier(o2) : o1 === o2;
  }

  addInventarioToCollectionIfMissing<Type extends Pick<IInventario, 'id'>>(
    inventarioCollection: Type[],
    ...inventariosToCheck: (Type | null | undefined)[]
  ): Type[] {
    const inventarios: Type[] = inventariosToCheck.filter(isPresent);
    if (inventarios.length > 0) {
      const inventarioCollectionIdentifiers = inventarioCollection.map(inventarioItem => this.getInventarioIdentifier(inventarioItem)!);
      const inventariosToAdd = inventarios.filter(inventarioItem => {
        const inventarioIdentifier = this.getInventarioIdentifier(inventarioItem);
        if (inventarioCollectionIdentifiers.includes(inventarioIdentifier)) {
          return false;
        }
        inventarioCollectionIdentifiers.push(inventarioIdentifier);
        return true;
      });
      return [...inventariosToAdd, ...inventarioCollection];
    }
    return inventarioCollection;
  }
}
