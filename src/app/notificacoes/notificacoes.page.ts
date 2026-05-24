import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-notificacoes',
  templateUrl: './notificacoes.page.html',
  styleUrls: ['./notificacoes.page.scss'],
  standalone: false,
})
export class NotificacoesPage implements OnInit {

  emailSelected: boolean = false;
  pushSelected: boolean = false;

  public products = this.productService.getProducts();

  constructor(private productService: ProductService) { }

  ngOnInit() {
  }

}
