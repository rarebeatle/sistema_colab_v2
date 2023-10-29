import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IMedicamento, NewMedicamento } from '../medicamento.model';

export type PartialUpdateMedicamento = Partial<IMedicamento> & Pick<IMedicamento, 'id'>;

export type EntityResponseType = HttpResponse<IMedicamento>;
export type EntityArrayResponseType = HttpResponse<IMedicamento[]>;

@Injectable({ providedIn: 'root' })
export class MedicamentoService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/medicamentos');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(medicamento: NewMedicamento): Observable<EntityResponseType> {
    return this.http.post<IMedicamento>(this.resourceUrl, medicamento, { observe: 'response' });
  }

  update(medicamento: IMedicamento): Observable<EntityResponseType> {
    return this.http.put<IMedicamento>(`${this.resourceUrl}/${this.getMedicamentoIdentifier(medicamento)}`, medicamento, {
      observe: 'response',
    });
  }

  partialUpdate(medicamento: PartialUpdateMedicamento): Observable<EntityResponseType> {
    return this.http.patch<IMedicamento>(`${this.resourceUrl}/${this.getMedicamentoIdentifier(medicamento)}`, medicamento, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IMedicamento>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IMedicamento[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getMedicamentoIdentifier(medicamento: Pick<IMedicamento, 'id'>): number {
    return medicamento.id;
  }

  compareMedicamento(o1: Pick<IMedicamento, 'id'> | null, o2: Pick<IMedicamento, 'id'> | null): boolean {
    return o1 && o2 ? this.getMedicamentoIdentifier(o1) === this.getMedicamentoIdentifier(o2) : o1 === o2;
  }

  addMedicamentoToCollectionIfMissing<Type extends Pick<IMedicamento, 'id'>>(
    medicamentoCollection: Type[],
    ...medicamentosToCheck: (Type | null | undefined)[]
  ): Type[] {
    const medicamentos: Type[] = medicamentosToCheck.filter(isPresent);
    if (medicamentos.length > 0) {
      const medicamentoCollectionIdentifiers = medicamentoCollection.map(
        medicamentoItem => this.getMedicamentoIdentifier(medicamentoItem)!,
      );
      const medicamentosToAdd = medicamentos.filter(medicamentoItem => {
        const medicamentoIdentifier = this.getMedicamentoIdentifier(medicamentoItem);
        if (medicamentoCollectionIdentifiers.includes(medicamentoIdentifier)) {
          return false;
        }
        medicamentoCollectionIdentifiers.push(medicamentoIdentifier);
        return true;
      });
      return [...medicamentosToAdd, ...medicamentoCollection];
    }
    return medicamentoCollection;
  }
}
