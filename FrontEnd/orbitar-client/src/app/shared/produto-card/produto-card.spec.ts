import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdutoCardComponent } from './produto-card';

describe('ProdutoCard', () => {
  let component: ProdutoCardComponent;
  let fixture: ComponentFixture<ProdutoCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProdutoCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProdutoCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
