  import { Component, Input, OnInit } from '@angular/core';
import { Product, ProductService } from '../services/product.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-selecionar-produto',
  templateUrl: './selecionar-produto.page.html',
  styleUrls: ['./selecionar-produto.page.scss'],
  standalone: false
})
export class SelecionarProdutoPage implements OnInit {


  produtos: Product[] = [];
  produtosFiltrados: Product[] = [];
  selecionados: Product[] = [];
  pesquisa: string = ''
  produtosJaAdicionados: any;
  

  constructor(private productService: ProductService
    , private modalController: ModalController
  ) { }


  async ngOnInit() {
    const todos = await this.productService.getProducts();
    this.produtos = todos.filter(p => this.produtosJaAdicionados.includes(p.id)); 
    this.produtosFiltrados = this.produtos;
  }


  filtrarProdutos() {
    this.produtosFiltrados = this.produtos.filter(p => p.nome.toLowerCase().includes(this.pesquisa.toLowerCase()));
  }

  //Esta função adiciona ou remove um produto da lista selecionados ao clicar nele.
  toggleSelecao(produto: Product) {
    const index = this.selecionados.indexOf(produto);
    if (index > -1) {
      this.selecionados.splice(index, 1);

    } else {
      this.selecionados.push(produto);
    }
  }


  cancelar() {
    this.modalController.dismiss();
  }

  confirmar() {
    this.modalController.dismiss(this.selecionados);
  }
}
