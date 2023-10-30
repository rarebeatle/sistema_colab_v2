import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { IMedicamento } from 'app/entities/medicamento/medicamento.model';
import { MedicamentoService } from 'app/entities/medicamento/service/medicamento.service';
import { InventarioService } from '../service/inventario.service';
import { IInventario } from '../inventario.model';
import { InventarioFormService } from './inventario-form.service';

import { InventarioUpdateComponent } from './inventario-update.component';

describe('Inventario Management Update Component', () => {
  let comp: InventarioUpdateComponent;
  let fixture: ComponentFixture<InventarioUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let inventarioFormService: InventarioFormService;
  let inventarioService: InventarioService;
  let medicamentoService: MedicamentoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), InventarioUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(InventarioUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(InventarioUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    inventarioFormService = TestBed.inject(InventarioFormService);
    inventarioService = TestBed.inject(InventarioService);
    medicamentoService = TestBed.inject(MedicamentoService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call medicamento query and add missing value', () => {
      const inventario: IInventario = { id: 456 };
      const medicamento: IMedicamento = { id: 29461 };
      inventario.medicamento = medicamento;

      const medicamentoCollection: IMedicamento[] = [{ id: 6980 }];
      jest.spyOn(medicamentoService, 'query').mockReturnValue(of(new HttpResponse({ body: medicamentoCollection })));
      const expectedCollection: IMedicamento[] = [medicamento, ...medicamentoCollection];
      jest.spyOn(medicamentoService, 'addMedicamentoToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ inventario });
      comp.ngOnInit();

      expect(medicamentoService.query).toHaveBeenCalled();
      expect(medicamentoService.addMedicamentoToCollectionIfMissing).toHaveBeenCalledWith(medicamentoCollection, medicamento);
      expect(comp.medicamentosCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const inventario: IInventario = { id: 456 };
      const medicamento: IMedicamento = { id: 19517 };
      inventario.medicamento = medicamento;

      activatedRoute.data = of({ inventario });
      comp.ngOnInit();

      expect(comp.medicamentosCollection).toContain(medicamento);
      expect(comp.inventario).toEqual(inventario);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IInventario>>();
      const inventario = { id: 123 };
      jest.spyOn(inventarioFormService, 'getInventario').mockReturnValue(inventario);
      jest.spyOn(inventarioService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ inventario });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: inventario }));
      saveSubject.complete();

      // THEN
      expect(inventarioFormService.getInventario).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(inventarioService.update).toHaveBeenCalledWith(expect.objectContaining(inventario));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IInventario>>();
      const inventario = { id: 123 };
      jest.spyOn(inventarioFormService, 'getInventario').mockReturnValue({ id: null });
      jest.spyOn(inventarioService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ inventario: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: inventario }));
      saveSubject.complete();

      // THEN
      expect(inventarioFormService.getInventario).toHaveBeenCalled();
      expect(inventarioService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IInventario>>();
      const inventario = { id: 123 };
      jest.spyOn(inventarioService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ inventario });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(inventarioService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareMedicamento', () => {
      it('Should forward to medicamentoService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(medicamentoService, 'compareMedicamento');
        comp.compareMedicamento(entity, entity2);
        expect(medicamentoService.compareMedicamento).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
