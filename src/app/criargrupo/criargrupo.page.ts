import { Component, OnInit } from '@angular/core';
import { GrupoService } from '../services/grupo.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-criargrupo',
  templateUrl: './criargrupo.page.html',
  styleUrls: ['./criargrupo.page.scss'],
   standalone: false
})
export class CriargrupoPage implements OnInit {

  constructor(private Grupoadd: GrupoService, private router: Router) { }

  ngOnInit() {}



iconesSugeridos = ['home', 'briefcase', 'business', 'tv'];
iconeEscolhido = 'home'; 

selecionarIcone(icone: string) {
  this.iconeEscolhido = icone;
}


nomeGrupo: string = '';
descricaoGrupo: string = '';

  async criarGrupo() {
    if (!this.nomeGrupo.trim()) return;
    await this.Grupoadd.addGrupo(this.nomeGrupo, this.descricaoGrupo, this.iconeEscolhido);
    this.router.navigateByUrl('/tabs/tab3');
  }



}

