import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelecionarPessoaPage } from './selecionar-pessoa.page';

const routes: Routes = [
  {
    path: '',
    component: SelecionarPessoaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelecionarPessoaPageRoutingModule {}
