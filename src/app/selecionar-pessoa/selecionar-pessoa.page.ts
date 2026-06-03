import { Component, Input, OnInit } from '@angular/core';
import { Randomuser } from '../services/randomuser';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-selecionar-pessoa',
  templateUrl: './selecionar-pessoa.page.html',
  styleUrls: ['./selecionar-pessoa.page.scss'],
  standalone: false
})
export class SelecionarPessoaPage implements OnInit {


  @Input() pessoasJaAdicionadas: string[] = [];

  pessoas: any[] = [];
  pessoasFiltradas: any[] = [];
  selecionadas: any[] = [];
  pesquisa: string = '';

  constructor(private randomuserService: Randomuser, private modalController: ModalController) { }

  async ngOnInit() {
    const todas = await this.randomuserService.getPessoas();
    this.pessoas = todas.filter(p =>
      !this.pessoasJaAdicionadas.includes(`${p.name.first} ${p.name.last}`)
    );
    this.pessoasFiltradas = this.pessoas;
  }

  filtrar() {
  this.pessoasFiltradas = this.pessoas.filter(p =>
    `${p.name.first} ${p.name.last}`.toLowerCase().includes(this.pesquisa.toLowerCase())
  );
  }
  toggleSelecao(pessoa: any) {
  const index = this.selecionadas.indexOf(pessoa);
  if (index > -1) {
    this.selecionadas.splice(index, 1);
  } else {
    
    this.selecionadas.push(pessoa);
    }
  }

  cancelar() {
    this.modalController.dismiss();
  }

  confirmar() {
    this.modalController.dismiss(this.selecionadas);
  }


}
