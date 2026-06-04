import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GrupoDetalhePageRoutingModule } from './grupo-detalhe-routing.module';

import { GrupoDetalhePage } from './grupo-detalhe.page';
import { SelecionarPessoaPage } from '../selecionar-pessoa/selecionar-pessoa.page';
import { SelecionarProdutoPage } from '../selecionar-produto/selecionar-produto.page';
import { StatusBadgeComponent } from '../components/status-badge/status-badge.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GrupoDetalhePageRoutingModule,
    StatusBadgeComponent
  ],
  declarations: [GrupoDetalhePage, SelecionarPessoaPage, SelecionarProdutoPage]
})
export class GrupoDetalhePageModule {}
