import { Component, OnInit } from '@angular/core';
import { Group, GrupoService } from '../services/grupo.service';
import { ActivatedRoute } from '@angular/router';
import { Randomuser } from '../services/randomuser';
import { ModalController } from '@ionic/angular';
import { SelecionarPessoaPage } from '../selecionar-pessoa/selecionar-pessoa.page';
import { Product, ProductService } from '../services/product.service';
import { SelecionarProdutoPage } from '../selecionar-produto/selecionar-produto.page';



@Component({
  selector: 'app-grupo-detalhe',
  templateUrl: './grupo-detalhe.page.html',
  styleUrls: ['./grupo-detalhe.page.scss'],
  standalone: false
  
})
export class GrupoDetalhePage implements OnInit {

  grupo: Group | undefined;
  pessoas: any[] = [];
  produtos: Product[] = [];

  

  constructor(private grupoService: GrupoService, 
    private route: ActivatedRoute, private randomUserService: Randomuser,
     private modalController: ModalController, private productService: ProductService) { }

  async ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.grupo = await this.grupoService.getGrupoById(id);
    this.pessoas = await this.randomUserService.getPessoas();

    for (const produtoId of this.grupo?.produtos || []) {
      const produto = await this.productService.getProductById(produtoId);
      if (produto) {
        this.produtos.push(produto);
      }
    }
   }


getFoto(nome: string): string {
  const pessoa = this.pessoas.find(p => `${p.name.first} ${p.name.last}` === nome);
  return pessoa?.picture?.thumbnail || '';
}

async abrirModal() {
  const modal = await this.modalController.create({
    component: SelecionarPessoaPage,
    componentProps: { pessoasJaAdicionadas: this.grupo!.pessoas }
  });
  await modal.present();

  const { data } = await modal.onDidDismiss();
  if (data && data.length > 0) {
    for (const pessoa of data) {
      const nome = `${pessoa.name.first} ${pessoa.name.last}`;
      await this.grupoService.adicionarPessoa(this.grupo!.id, nome);
      this.grupo!.pessoas.push(nome);
    }
  }
}

getTextoExpiracao(produto: Product): string {
    const expiracao = new Date(produto.dataCompra);
    expiracao.setMonth(expiracao.getMonth() + produto.duracaoGarantia);
    const hoje = new Date();
    const dias = Math.ceil((expiracao.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
    if (dias < 0) return 'Garantia expirada';
    if (dias < 30) return `Expira em ${dias} dias`;
    if (dias < 365) {
      const meses = Math.floor(dias / 30);
      return `Expira em ${meses} ${meses === 1 ? 'mês' : 'meses'}`;
    }
    const anos = Math.floor(dias / 365);
    return `Expira em ${anos} ${anos === 1 ? 'ano' : 'anos'}`;
  }

async abrirModalProdutos(){
    const modal = await this.modalController.create({
      component: SelecionarProdutoPage,
      componentProps: { produtosJaAdicionados: this.grupo!.produtos }
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data && data.length > 0) {
      for (const produto of data) {
        this.grupo!.produtos.push(produto.id);
        this.produtos.push(produto);
      }
      await this.grupoService.guardarGrupo(this.grupo!);
    
    }
}




}
