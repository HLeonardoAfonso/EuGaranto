import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelecionarPessoaPage } from './selecionar-pessoa.page';

describe('SelecionarPessoaPage', () => {
  let component: SelecionarPessoaPage;
  let fixture: ComponentFixture<SelecionarPessoaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SelecionarPessoaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
