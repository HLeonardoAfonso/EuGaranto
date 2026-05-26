import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CriargrupoPage } from './criargrupo.page';

describe('CriargrupoPage', () => {
  let component: CriargrupoPage;
  let fixture: ComponentFixture<CriargrupoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CriargrupoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
