import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page {

  pickerOpen = false;
  durationValue = 2;
  durationUnit = 'ANOS';
  numberOptions: number[] = [];

  // Form fields
  nome: string = '';
  marca: string = '';
  modelo: string = '';
  dataCompra: string = '';

  constructor(
    private productService: ProductService,
    private navCtrl: NavController
  ) {
    this.updateNumberOptions();
  }

  updateNumberOptions() {
    const max = this.durationUnit === 'DIAS' ? 31 : this.durationUnit === 'MESES' ? 12 : 20;
    this.numberOptions = Array.from({ length: max }, (_, i) => i + 1);
    if (this.durationValue > max) {
      this.durationValue = max;
    }
  }

  onUnitChange() {
    this.updateNumberOptions();
  }

  confirmarRegisto() {

    // todos os campos preenchidos
    if (!this.nome || !this.marca || !this.modelo || !this.dataCompra) {
      return;
    }

    // Convert duration to months
    let duracaoGarantia: number;
    switch (this.durationUnit) {
      case 'DIAS':
        duracaoGarantia = Math.round(this.durationValue / 30);
        break;
      case 'MESES':
        duracaoGarantia = this.durationValue;
        break;
      case 'ANOS':
        duracaoGarantia = this.durationValue * 12;
        break;
      default:
        duracaoGarantia = this.durationValue;
    }

    this.productService.addProduct({
      nome: this.nome,
      marca: this.marca,
      modelo: this.modelo,
      dataCompra: new Date(this.dataCompra),
      duracaoGarantia: duracaoGarantia,
      statusValido: true,
      notications: false
    });

    this.navCtrl.navigateRoot('/tabs/tab1');
  }
}
