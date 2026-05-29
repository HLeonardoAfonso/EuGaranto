import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CriargrupoPage } from './criargrupo.page';

const routes: Routes = [
  {
    path: '',
    component: CriargrupoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CriargrupoPageRoutingModule {}
