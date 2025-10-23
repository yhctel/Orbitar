import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinhasDoacoesComponent } from './minhas-doacoes';

describe('MinhasDoacoes', () => {
  let component: MinhasDoacoesComponent;
  let fixture: ComponentFixture<MinhasDoacoesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MinhasDoacoesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MinhasDoacoesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
