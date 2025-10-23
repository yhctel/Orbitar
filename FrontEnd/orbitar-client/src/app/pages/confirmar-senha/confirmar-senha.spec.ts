import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmarSenhaComponent } from './confirmar-senha';

describe('ConfirmarSenha', () => {
  let component: ConfirmarSenhaComponent;
  let fixture: ComponentFixture<ConfirmarSenhaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmarSenhaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmarSenhaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
