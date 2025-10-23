import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastrarProdutoComponent } from './cadastrar-produto';

describe('CadastrarProduto', () => {
  let component: CadastrarProdutoComponent;
  let fixture: ComponentFixture<CadastrarProdutoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastrarProdutoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastrarProdutoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
