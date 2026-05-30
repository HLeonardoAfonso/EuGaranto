import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

export interface Group {
  id: number;
  nome: string;
  descricao: string;
  icone: string;
  produtos: number[];
  pessoas: string[];
}

const GRUPOS_STORAGE_KEY = '_gruposdb';

@Injectable({
  providedIn: 'root',
})
export class GrupoService {

  private grupos: Group[] = [];

  constructor(private storage: Storage) {}

  async getGrupos(): Promise<Group[]> {
    const stored = await this.storage.get(GRUPOS_STORAGE_KEY);
    return stored || this.grupos;
  }

  async addGrupo(nome: string, descricao: string, icone: string): Promise<Group> {
    const grupos = await this.getGrupos();
    const grupo: Group = {
      id: grupos.length + 1,
      nome,
      descricao,
      icone,
      produtos: [],
      pessoas: []
    };
    grupos.push(grupo);
    this.grupos = grupos;
    await this.storage.set(GRUPOS_STORAGE_KEY, this.grupos);
    return grupo;
  }

  async getGrupoById(id: number): Promise<Group | undefined> {
    const grupos = await this.getGrupos();
    return grupos.find(g => g.id === id);
  }

}
