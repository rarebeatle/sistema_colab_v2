import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IInventario } from '../inventario.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../inventario.test-samples';

import { InventarioService } from './inventario.service';

const requireRestSample: IInventario = {
  ...sampleWithRequiredData,
};

describe('Inventario Service', () => {
  let service: InventarioService;
  let httpMock: HttpTestingController;
  let expectedResult: IInventario | IInventario[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(InventarioService);
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

    it('should create a Inventario', () => {
      const inventario = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(inventario).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Inventario', () => {
      const inventario = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(inventario).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Inventario', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Inventario', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Inventario', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addInventarioToCollectionIfMissing', () => {
      it('should add a Inventario to an empty array', () => {
        const inventario: IInventario = sampleWithRequiredData;
        expectedResult = service.addInventarioToCollectionIfMissing([], inventario);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(inventario);
      });

      it('should not add a Inventario to an array that contains it', () => {
        const inventario: IInventario = sampleWithRequiredData;
        const inventarioCollection: IInventario[] = [
          {
            ...inventario,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addInventarioToCollectionIfMissing(inventarioCollection, inventario);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Inventario to an array that doesn't contain it", () => {
        const inventario: IInventario = sampleWithRequiredData;
        const inventarioCollection: IInventario[] = [sampleWithPartialData];
        expectedResult = service.addInventarioToCollectionIfMissing(inventarioCollection, inventario);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(inventario);
      });

      it('should add only unique Inventario to an array', () => {
        const inventarioArray: IInventario[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const inventarioCollection: IInventario[] = [sampleWithRequiredData];
        expectedResult = service.addInventarioToCollectionIfMissing(inventarioCollection, ...inventarioArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const inventario: IInventario = sampleWithRequiredData;
        const inventario2: IInventario = sampleWithPartialData;
        expectedResult = service.addInventarioToCollectionIfMissing([], inventario, inventario2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(inventario);
        expect(expectedResult).toContain(inventario2);
      });

      it('should accept null and undefined values', () => {
        const inventario: IInventario = sampleWithRequiredData;
        expectedResult = service.addInventarioToCollectionIfMissing([], null, inventario, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(inventario);
      });

      it('should return initial array if no Inventario is added', () => {
        const inventarioCollection: IInventario[] = [sampleWithRequiredData];
        expectedResult = service.addInventarioToCollectionIfMissing(inventarioCollection, undefined, null);
        expect(expectedResult).toEqual(inventarioCollection);
      });
    });

    describe('compareInventario', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareInventario(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareInventario(entity1, entity2);
        const compareResult2 = service.compareInventario(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareInventario(entity1, entity2);
        const compareResult2 = service.compareInventario(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareInventario(entity1, entity2);
        const compareResult2 = service.compareInventario(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
