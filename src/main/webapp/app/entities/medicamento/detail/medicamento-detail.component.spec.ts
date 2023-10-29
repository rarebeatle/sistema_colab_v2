import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { MedicamentoDetailComponent } from './medicamento-detail.component';

describe('Medicamento Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicamentoDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: MedicamentoDetailComponent,
              resolve: { medicamento: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(MedicamentoDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load medicamento on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', MedicamentoDetailComponent);

      // THEN
      expect(instance.medicamento).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
