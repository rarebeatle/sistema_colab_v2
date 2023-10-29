import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IMedicamento } from '../medicamento.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../medicamento.test-samples';

import { MedicamentoService } from './medicamento.service';

const requireRestSample: IMedicamento = {
  ...sampleWithRequiredData,
};

describe('Medicamento Service', () => {
  let service: MedicamentoService;
  let httpMock: HttpTestingController;
  let expectedResult: IMedicamento | IMedicamento[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(MedicamentoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Medicamento', () => {
      const medicamento = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(medicamento).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Medicamento', () => {
      const medicamento = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(medicamento).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Medicamento', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Medicamento', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Medicamento', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addMedicamentoToCollectionIfMissing', () => {
      it('should add a Medicamento to an empty array', () => {
        const medicamento: IMedicamento = sampleWithRequiredData;
        expectedResult = service.addMedicamentoToCollectionIfMissing([], medicamento);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(medicamento);
      });

      it('should not add a Medicamento to an array that contains it', () => {
        const medicamento: IMedicamento = sampleWithRequiredData;
        const medicamentoCollection: IMedicamento[] = [
          {
            ...medicamento,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addMedicamentoToCollectionIfMissing(medicamentoCollection, medicamento);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Medicamento to an array that doesn't contain it", () => {
        const medicamento: IMedicamento = sampleWithRequiredData;
        const medicamentoCollection: IMedicamento[] = [sampleWithPartialData];
        expectedResult = service.addMedicamentoToCollectionIfMissing(medicamentoCollection, medicamento);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(medicamento);
      });

      it('should add only unique Medicamento to an array', () => {
        const medicamentoArray: IMedicamento[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const medicamentoCollection: IMedicamento[] = [sampleWithRequiredData];
        expectedResult = service.addMedicamentoToCollectionIfMissing(medicamentoCollection, ...medicamentoArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const medicamento: IMedicamento = sampleWithRequiredData;
        const medicamento2: IMedicamento = sampleWithPartialData;
        expectedResult = service.addMedicamentoToCollectionIfMissing([], medicamento, medicamento2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(medicamento);
        expect(expectedResult).toContain(medicamento2);
      });

      it('should accept null and undefined values', () => {
        const medicamento: IMedicamento = sampleWithRequiredData;
        expectedResult = service.addMedicamentoToCollectionIfMissing([], null, medicamento, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(medicamento);
      });

      it('should return initial array if no Medicamento is added', () => {
        const medicamentoCollection: IMedicamento[] = [sampleWithRequiredData];
        expectedResult = service.addMedicamentoToCollectionIfMissing(medicamentoCollection, undefined, null);
        expect(expectedResult).toEqual(medicamentoCollection);
      });
    });

    describe('compareMedicamento', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareMedicamento(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareMedicamento(entity1, entity2);
        const compareResult2 = service.compareMedicamento(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareMedicamento(entity1, entity2);
        const compareResult2 = service.compareMedicamento(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareMedicamento(entity1, entity2);
        const compareResult2 = service.compareMedicamento(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
