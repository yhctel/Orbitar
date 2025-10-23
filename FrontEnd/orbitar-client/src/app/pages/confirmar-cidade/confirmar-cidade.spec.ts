import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmarCidadeComponent } from './confirmar-cidade';

describe('ConfirmarCidade', () => {
  let component: ConfirmarCidadeComponent;
  let fixture: ComponentFixture<ConfirmarCidadeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmarCidadeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmarCidadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
