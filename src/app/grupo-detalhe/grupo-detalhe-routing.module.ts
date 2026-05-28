import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GrupoDetalhePage } from './grupo-detalhe.page';

const routes: Routes = [
  {
    path: '',
    component: GrupoDetalhePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GrupoDetalhePageRoutingModule {}
