import { Component, OnInit } from '@angular/core';
import { GrupoService, Group } from '../services/grupo.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false,
})
export class Tab3Page implements OnInit {
  grupos: Group[] = [];

  constructor(private grupoService: GrupoService) {}

  ngOnInit() {
    this.grupos = this.grupoService.getGrupos();
  }
}