import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelecionarProdutoPage } from './selecionar-produto.page';

describe('SelecionarProdutoPage', () => {
  let component: SelecionarProdutoPage;
  let fixture: ComponentFixture<SelecionarProdutoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SelecionarProdutoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
