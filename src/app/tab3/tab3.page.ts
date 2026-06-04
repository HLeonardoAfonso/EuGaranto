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

  ngOnInit() {}

  async ionViewWillEnter() {
    this.grupos = await this.grupoService.getGrupos();
  }

  getCor(index: number): string {
    const cores = ['#4CAF50', '#607D8B', '#FF9800', '#2196F3', '#9C27B0'];
    return cores[index % cores.length];
  }
}
