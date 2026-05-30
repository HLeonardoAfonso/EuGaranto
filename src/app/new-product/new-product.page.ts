import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Product, ProductService } from '../services/product.service';

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.page.html',
  styleUrls: ['./new-product.page.scss'],
  standalone: false
})
export class NewProductPage implements OnInit {
  product!: Product;
  productName: string = '';
  garantiaPercentual: number = 0;
  notificacoesAtivas: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private navCtrl: NavController
  ) { }

  async ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const product = await this.productService.getProductById(id);

    if (!product) {
      this.navCtrl.navigateBack('/tabs/tab1');
      return;
    }

    this.product = product;
    this.productName = product.nome;
    this.calcularGarantia();
  }

  private calcularGarantia() {
    const p = this.product;
    const hoje = new Date();
    const dataCompra = new Date(p.dataCompra);
    const fimGarantia = new Date(dataCompra);
    fimGarantia.setMonth(fimGarantia.getMonth() + p.duracaoGarantia);

    const totalDias = (fimGarantia.getTime() - dataCompra.getTime()) / (1000 * 60 * 60 * 24);
    const diasPassados = (hoje.getTime() - dataCompra.getTime()) / (1000 * 60 * 60 * 24);

    if (diasPassados <= 0) {
      this.garantiaPercentual = 0;
    } else if (diasPassados >= totalDias) {
      this.garantiaPercentual = 100;
    } else {
      this.garantiaPercentual = Math.round((diasPassados / totalDias) * 100);
    }
  }

  get garantiaRestanteDias(): number {
    const hoje = new Date();
    const dataCompra = new Date(this.product.dataCompra);
    const fimGarantia = new Date(dataCompra);
    fimGarantia.setMonth(fimGarantia.getMonth() + this.product.duracaoGarantia);
    const diffMs = fimGarantia.getTime() - hoje.getTime();
    return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
  }

  get garantiaRestanteMeses(): number {
    return this.garantiaRestanteDias > 0 ? Math.ceil(this.garantiaRestanteDias / 30) : 0;
  }

  get progressCircumference(): number {
    return 2 * Math.PI * 50; // ≈ 314.159
  }

  get progressOffset(): number {
    return this.progressCircumference * (1 - this.garantiaPercentual / 100);
  }
}
