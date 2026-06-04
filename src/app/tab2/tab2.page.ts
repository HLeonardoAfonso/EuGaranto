import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page implements OnInit {

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

  // Edit mode
  editMode: boolean = false;
  editProductId: number | null = null;

  constructor(
    private productService: ProductService,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private alertController: AlertController
  ) {
    this.updateNumberOptions();
  }

  async ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      await this.carregarProdutoParaEdicao(id);
    } else {
      this.resetForm();
    }
  }

  private async carregarProdutoParaEdicao(id: number) {
    this.editMode = true;
    this.editProductId = id;
    const product = await this.productService.getProductById(id);
    if (!product) return;

    this.nome = product.nome;
    this.marca = product.marca;
    this.modelo = product.modelo;
    this.dataCompra = new Date(product.dataCompra).toISOString();
    this.fotoFatura = product.fotoFatura ?? null;
    this.fotoLocal = product.fotoLocal ?? null;

    const totalMeses = product.duracaoGarantia;
    if (totalMeses >= 12 && totalMeses % 12 === 0) {
      this.durationUnit = 'ANOS';
      this.durationValue = totalMeses / 12;
    } else {
      this.durationUnit = 'MESES';
      this.durationValue = totalMeses;
    }
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

  get fimGarantia(): Date | null {
    if (!this.dataCompra || !this.durationValue) {
      return null;
    }

    const data = new Date(this.dataCompra);
    if (Number.isNaN(data.getTime())) {
      return null;
    }

    const fim = new Date(data);
    switch (this.durationUnit) {
      case 'DIAS':
        fim.setDate(fim.getDate() + this.durationValue);
        break;
      case 'MESES':
        fim.setMonth(fim.getMonth() + this.durationValue);
        break;
      case 'ANOS':
        fim.setFullYear(fim.getFullYear() + this.durationValue);
        break;
    }

    return fim;
  }

  onDurationValueChange(event: CustomEvent) {
    this.durationValue = Number(event.detail.value);
  }

  onDurationUnitChange(event: CustomEvent) {
    this.durationUnit = event.detail.value;
    this.updateNumberOptions();
  }

  onDataCompraChange(event: CustomEvent) {
    const value = event.detail.value;
    this.dataCompra = Array.isArray(value) ? value[0] : value;
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

  async confirmarRegisto() {

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

    if (this.editMode && this.editProductId) {
      const productId = this.editProductId;

      await this.productService.updateProduct(productId, {
        nome: this.nome,
        marca: this.marca,
        modelo: this.modelo,
        dataCompra: new Date(this.dataCompra),
        duracaoGarantia: duracaoGarantia,
        fotoFatura: this.fotoFatura ?? undefined,
        fotoLocal: this.fotoLocal ?? undefined,
      });

      this.resetForm();
      this.navCtrl.navigateRoot(`/new-product/${productId}`);

    } else {
      await this.productService.addProduct({
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

      this.resetForm();
      this.navCtrl.navigateRoot('/tabs/tab1');

    }
  }

  private resetForm() {
    this.nome = '';
    this.marca = '';
    this.modelo = '';
    this.dataCompra = '';
    this.fotoFatura = null;
    this.fotoLocal = null;
    this.durationValue = 2;
    this.durationUnit = 'ANOS';
    this.editMode = false;
    this.editProductId = null;
    this.updateNumberOptions();
  }

  async apagarProduto() {

    const alert = await this.alertController.create({
      header: 'Apagar garantia?',
      message: 'Esta ação não pode ser anulada.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Apagar',
          role: 'destructive',
          handler: async () => {
            await this.productService.deleteProduct(this.editProductId!);
            this.navCtrl.navigateRoot('/tabs/tab1');
          },
        },
      ],
    });

    await alert.present();
  }
}
