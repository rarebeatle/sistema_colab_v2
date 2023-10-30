import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { MedicamentoService } from '../service/medicamento.service';
import { IMedicamento } from '../medicamento.model';
import { MedicamentoFormService } from './medicamento-form.service';

import { MedicamentoUpdateComponent } from './medicamento-update.component';

describe('Medicamento Management Update Component', () => {
  let comp: MedicamentoUpdateComponent;
  let fixture: ComponentFixture<MedicamentoUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let medicamentoFormService: MedicamentoFormService;
  let medicamentoService: MedicamentoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), MedicamentoUpdateComponent],
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
      .overrideTemplate(MedicamentoUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MedicamentoUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    medicamentoFormService = TestBed.inject(MedicamentoFormService);
    medicamentoService = TestBed.inject(MedicamentoService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const medicamento: IMedicamento = { id: 456 };

      activatedRoute.data = of({ medicamento });
      comp.ngOnInit();

      expect(comp.medicamento).toEqual(medicamento);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMedicamento>>();
      const medicamento = { id: 123 };
      jest.spyOn(medicamentoFormService, 'getMedicamento').mockReturnValue(medicamento);
      jest.spyOn(medicamentoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ medicamento });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: medicamento }));
      saveSubject.complete();

      // THEN
      expect(medicamentoFormService.getMedicamento).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(medicamentoService.update).toHaveBeenCalledWith(expect.objectContaining(medicamento));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMedicamento>>();
      const medicamento = { id: 123 };
      jest.spyOn(medicamentoFormService, 'getMedicamento').mockReturnValue({ id: null });
      jest.spyOn(medicamentoService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ medicamento: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: medicamento }));
      saveSubject.complete();

      // THEN
      expect(medicamentoFormService.getMedicamento).toHaveBeenCalled();
      expect(medicamentoService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMedicamento>>();
      const medicamento = { id: 123 };
      jest.spyOn(medicamentoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ medicamento });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(medicamentoService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
