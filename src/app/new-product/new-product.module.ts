import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewProductPageRoutingModule } from './new-product-routing.module';

import { NewProductPage } from './new-product.page';
import { StatusBadgeComponent } from '../components/status-badge/status-badge.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewProductPageRoutingModule,
    StatusBadgeComponent
  ],
  declarations: [NewProductPage]
})
export class NewProductPageModule {}
