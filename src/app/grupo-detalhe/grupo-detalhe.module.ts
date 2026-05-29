import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GrupoDetalhePageRoutingModule } from './grupo-detalhe-routing.module';

import { GrupoDetalhePage } from './grupo-detalhe.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GrupoDetalhePageRoutingModule
  ],
  declarations: [GrupoDetalhePage]
})
export class GrupoDetalhePageModule {}
