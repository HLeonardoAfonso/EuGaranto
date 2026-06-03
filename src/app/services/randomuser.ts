import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root',
})
export class Randomuser {


  // endereço da API para obter os dados dos usuários
  private apiUrl = 'https://randomuser.me/api/?results=10';
  
  //contrutor para injetar o serviço HttpClient
  constructor(private http: HttpClient, private storage: Storage) {}


  
  async getPessoas(): Promise<any[]> {

    //Verifica se Já existem no storage
    const guardadas = await this.storage.get('pessoas');
    
    //Se existirem no storage, retorna-as
    if (guardadas){
      return guardadas;
    }
    //Se não existirem, chama a API guarda e retorna
    const dados = await firstValueFrom(this.http.get<any>(this.apiUrl));
    await this.storage.set('pessoas', dados.results);
    return dados.results;
  }

}
