import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ProductService } from '../services/product.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

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

  // Image fields
  fotoFatura: string | null = null;
  fotoLocal: string | null = null;

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

  async tirarFoto(tipo: 'fatura' | 'local') {
    try {
      const image = await Camera.getPhoto({
        quality: 70,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Prompt,
        promptLabelHeader: 'Selecionar Origem',
        promptLabelCancel: 'Cancelar',
      });

      if (image.dataUrl) {
        if (tipo === 'fatura') {
          this.fotoFatura = image.dataUrl;
        } else {
          this.fotoLocal = image.dataUrl;
        }
      }
    } catch (error) {
      // User cancelled or error occurred
      console.error('Camera error:', error);
    }
  }

  removerFoto(tipo: 'fatura' | 'local') {
    if (tipo === 'fatura') {
      this.fotoFatura = null;
    } else {
      this.fotoLocal = null;
    }
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
      notications: false,
      fotoFatura: this.fotoFatura ?? undefined,
      fotoLocal: this.fotoLocal ?? undefined,
    });

    this.navCtrl.navigateRoot('/tabs/tab1');
  }
}