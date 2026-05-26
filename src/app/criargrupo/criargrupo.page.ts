import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-criargrupo',
  templateUrl: './criargrupo.page.html',
  styleUrls: ['./criargrupo.page.scss'],
   standalone: false
})
export class CriargrupoPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }


iconesSugeridos = ['home', 'briefcase', 'business', 'tv'];
iconeEscolhido = 'home'; 

selecionarIcone(icone: string) {
  this.iconeEscolhido = icone;
}

}

