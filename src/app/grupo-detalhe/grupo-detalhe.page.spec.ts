import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GrupoDetalhePage } from './grupo-detalhe.page';

describe('GrupoDetalhePage', () => {
  let component: GrupoDetalhePage;
  let fixture: ComponentFixture<GrupoDetalhePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GrupoDetalhePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
