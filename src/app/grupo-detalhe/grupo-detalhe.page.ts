import { Component, OnInit } from '@angular/core';
import { Group, GrupoService } from '../services/grupo.service';
import { ActivatedRoute } from '@angular/router';
  

@Component({
  selector: 'app-grupo-detalhe',
  templateUrl: './grupo-detalhe.page.html',
  styleUrls: ['./grupo-detalhe.page.scss'],
  standalone: false
})
export class GrupoDetalhePage implements OnInit {

  grupo: Group | undefined;

  constructor(private grupoService: GrupoService, private route: ActivatedRoute) { }

  async ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.grupo = await this.grupoService.getGrupoById(id);
  }

}
