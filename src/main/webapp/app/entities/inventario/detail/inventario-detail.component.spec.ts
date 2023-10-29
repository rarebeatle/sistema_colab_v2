import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { InventarioDetailComponent } from './inventario-detail.component';

describe('Inventario Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventarioDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: InventarioDetailComponent,
              resolve: { inventario: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(InventarioDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load inventario on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', InventarioDetailComponent);

      // THEN
      expect(instance.inventario).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
