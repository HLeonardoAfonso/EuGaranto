import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelecionarProdutoPage } from './selecionar-produto.page';

const routes: Routes = [
  {
    path: '',
    component: SelecionarProdutoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelecionarProdutoPageRoutingModule {}
