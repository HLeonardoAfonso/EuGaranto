import { isStandalone, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CriargrupoPageRoutingModule } from './criargrupo-routing.module';

import { CriargrupoPage } from './criargrupo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CriargrupoPageRoutingModule,
    
  ],
  declarations: [CriargrupoPage]
})
export class CriargrupoPageModule {}
