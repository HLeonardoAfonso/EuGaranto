import { Component } from '@angular/core';
import { Product, ProductService } from '../services/product.service';

@Component({
  selector: 'app-notificacoes',
  templateUrl: './notificacoes.page.html',
  styleUrls: ['./notificacoes.page.scss'],
  standalone: false,
})

export class NotificacoesPage {

  emailSelected: boolean = false;
  pushSelected: boolean = false;

  public products: Product[] = [];

  constructor(private productService: ProductService) { }

  async ionViewWillEnter() {
    this.products = await this.productService.getProducts();
  }

}
