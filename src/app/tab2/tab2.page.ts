import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  form!: FormGroup;

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
    private router: Router,
    private alertController: AlertController,
    private fb: FormBuilder
  ) {
    this.updateNumberOptions();
    this.initializeForm();
  }

  private initializeForm() {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      dataCompra: ['', Validators.required],
    });
  }

  get f() {
    return this.form.controls;
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

    this.form.patchValue({
      nome: product.nome,
      marca: product.marca,
      modelo: product.modelo,
      dataCompra: new Date(product.dataCompra).toISOString(),
    });
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
    const dataCompra = this.form.get('dataCompra')?.value;
    if (!dataCompra || !this.durationValue) {
      return null;
    }

    const data = new Date(dataCompra);
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
    const dataCompra = Array.isArray(value) ? value[0] : value;
    this.form.get('dataCompra')?.setValue(dataCompra);
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
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    const { nome, marca, modelo, dataCompra } = this.form.value;

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
        nome: nome,
        marca: marca,
        modelo: modelo,
        dataCompra: new Date(dataCompra),
        duracaoGarantia: duracaoGarantia,
        fotoFatura: this.fotoFatura ?? undefined,
        fotoLocal: this.fotoLocal ?? undefined,
      });

      this.resetForm();
      this.navCtrl.navigateRoot(`/new-product/${productId}`);

    } else {
      await this.productService.addProduct({
        nome: nome,
        marca: marca,
        modelo: modelo,
        dataCompra: new Date(dataCompra),
        duracaoGarantia: duracaoGarantia,
        statusValido: true,
        notications: false,
        fotoFatura: this.fotoFatura ?? undefined,
        fotoLocal: this.fotoLocal ?? undefined,
      });

      this.resetForm();
      this.router.navigate(['/tabs/tab1']);

    }
  }

  private resetForm() {
    this.form.reset();
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
            console.log('[Tab2] Product deleted, navigating to tab1');
            this.router.navigate(['/tabs/tab1']);
          },
        },
      ],
    });

    await alert.present();
  }
}
