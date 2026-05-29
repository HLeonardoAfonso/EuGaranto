import { Injectable } from '@angular/core';



export interface Group {
  id: number;
  nome: string;
  descricao: string;
  icone: string;
  produtos: number[];
  pessoas: string[];
}


@Injectable({
  providedIn: 'root',
})
export class GrupoService {


   private grupos: Group[] = [];
  

  getGrupos() {
    return this.grupos;
  }

  addGrupo(nome: string, descricao: string, icone: string) {
    const grupo: Group  = { id : this.grupos.length + 1, 
      nome, 
      descricao,
      icone,
      produtos: [],
      pessoas: []
    };
    this.grupos.push(grupo);

  }

  getGrupoById(id: number): Group | undefined {
    return this.grupos.find(g => g.id === id);
  }

}
