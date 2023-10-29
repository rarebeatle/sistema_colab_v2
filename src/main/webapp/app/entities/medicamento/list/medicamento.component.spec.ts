import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { MedicamentoService } from '../service/medicamento.service';

import { MedicamentoComponent } from './medicamento.component';

describe('Medicamento Management Component', () => {
  let comp: MedicamentoComponent;
  let fixture: ComponentFixture<MedicamentoComponent>;
  let service: MedicamentoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'medicamento', component: MedicamentoComponent }]),
        HttpClientTestingModule,
        MedicamentoComponent,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              }),
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(MedicamentoComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MedicamentoComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(MedicamentoService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        }),
      ),
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.medicamentos?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to medicamentoService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getMedicamentoIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getMedicamentoIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
