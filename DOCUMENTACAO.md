# EuGaranto — Documentação do Código

Este ficheiro documenta todo o código desenvolvido na aplicação, explicando o que cada parte faz e porquê foi feita dessa forma.

---

## Índice

1. [Serviço de Grupos — `grupo.service.ts`](#1-serviço-de-grupos)
2. [Serviço de Utilizadores — `randomuser.ts`](#2-serviço-de-utilizadores-externos)
3. [Lista de Grupos — `tab3.page.ts`](#3-lista-de-grupos--tab3)
4. [Detalhe do Grupo — `grupo-detalhe`](#4-detalhe-do-grupo)
5. [Modal Selecionar Pessoa — `selecionar-pessoa`](#5-modal-selecionar-pessoa)
6. [Módulo do Detalhe do Grupo — `grupo-detalhe.module.ts`](#6-módulo-do-detalhe-do-grupo)

---

## 1. Serviço de Grupos

**Ficheiro:** `src/app/services/grupo.service.ts`

Este serviço é responsável por guardar, carregar e modificar os grupos. Usa o `@ionic/storage-angular` para persistir os dados no dispositivo — ou seja, os grupos não se perdem quando a aplicação fecha.

```typescript
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

  async adicionarPessoa(grupoId: number, nome: string): Promise<void> {
    const grupos = await this.getGrupos();
    const grupo = grupos.find(g => g.id === grupoId);
    if (grupo) {
      grupo.pessoas.push(nome);
      await this.storage.set(GRUPOS_STORAGE_KEY, grupos);
    }
  }
}
```

### Explicação

| Elemento | O que é | Para que serve |
|---|---|---|
| `interface Group` | Define a estrutura de um grupo | Diz ao TypeScript quais campos um grupo tem |
| `GRUPOS_STORAGE_KEY` | Chave de texto `'_gruposdb'` | É o "nome da gaveta" onde os grupos ficam guardados no storage |
| `getGrupos()` | Método assíncrono | Lê os grupos do storage. Se não houver nada guardado, devolve a lista vazia |
| `addGrupo()` | Método assíncrono | Cria um novo grupo, adiciona à lista e guarda no storage |
| `getGrupoById()` | Método assíncrono | Encontra um grupo pelo seu `id` |
| `adicionarPessoa()` | Método assíncrono | Adiciona um nome à lista `pessoas` de um grupo e guarda |

---

## 2. Serviço de Utilizadores Externos

**Ficheiro:** `src/app/services/randomuser.ts`

Este serviço vai buscar utilizadores à API [randomuser.me](https://randomuser.me). Para que os utilizadores sejam **sempre os mesmos** (e não mudem a cada vez que a app abre), são guardados no storage na primeira chamada.

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root',
})
export class Randomuser {

  private apiUrl = 'https://randomuser.me/api/?results=10';

  constructor(private http: HttpClient, private storage: Storage) {}

  async getPessoas(): Promise<any[]> {
    const guardadas = await this.storage.get('pessoas');

    if (guardadas) {
      return guardadas;
    }

    const dados = await firstValueFrom(this.http.get<any>(this.apiUrl));
    await this.storage.set('pessoas', dados.results);
    return dados.results;
  }
}
```

### Explicação

| Elemento | O que é | Para que serve |
|---|---|---|
| `HttpClient` | Serviço do Angular | Faz pedidos HTTP (GET, POST, etc.) |
| `firstValueFrom()` | Função do RxJS | Converte um Observable em Promise, para poder usar com `await` |
| `Storage` | Serviço do Ionic | Guarda dados persistentes no dispositivo |
| `this.storage.get('pessoas')` | Lê do storage | Verifica se já há utilizadores guardados |
| `firstValueFrom(this.http.get(...))` | Chamada à API | Só é executada se não houver utilizadores guardados |

**Porquê o `firstValueFrom`?**
O `HttpClient.get()` devolve um `Observable`, não uma `Promise`. O `await` só funciona com `Promise`. O `firstValueFrom()` converte o Observable em Promise, aguardando o primeiro valor que chegar.

---

## 3. Lista de Grupos — Tab3

**Ficheiro:** `src/app/tab3/tab3.page.ts`

```typescript
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
}
```

### Explicação

**Porquê `ionViewWillEnter` em vez de `ngOnInit`?**

| Método | Quando é chamado |
|---|---|
| `ngOnInit()` | Uma só vez, quando a página é criada pela primeira vez |
| `ionViewWillEnter()` | Cada vez que a página aparece no ecrã (incluindo ao voltar a ela) |

A lista de grupos não atualizava porque `ngOnInit` só corre uma vez. Com `ionViewWillEnter`, a lista é recarregada do storage sempre que o utilizador navega para o Tab3.

---

## 4. Detalhe do Grupo

### TypeScript — `grupo-detalhe.page.ts`

```typescript
import { Component, OnInit } from '@angular/core';
import { Group, GrupoService } from '../services/grupo.service';
import { ActivatedRoute } from '@angular/router';
import { Randomuser } from '../services/randomuser';
import { ModalController } from '@ionic/angular';
import { SelecionarPessoaPage } from '../selecionar-pessoa/selecionar-pessoa.page';

@Component({
  selector: 'app-grupo-detalhe',
  templateUrl: './grupo-detalhe.page.html',
  styleUrls: ['./grupo-detalhe.page.scss'],
  standalone: false
})
export class GrupoDetalhePage implements OnInit {

  grupo: Group | undefined;
  pessoas: any[] = [];

  constructor(
    private grupoService: GrupoService,
    private route: ActivatedRoute,
    private randomUserService: Randomuser,
    private modalController: ModalController
  ) {}

  async ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.grupo = await this.grupoService.getGrupoById(id);
    this.pessoas = await this.randomUserService.getPessoas();
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
}
```

### Explicação

| Elemento | O que é | Para que serve |
|---|---|---|
| `ActivatedRoute` | Serviço do Angular | Permite ler parâmetros da URL (ex: o `id` do grupo) |
| `ModalController` | Serviço do Ionic | Abre e fecha modais |
| `route.snapshot.paramMap.get('id')` | Lê da URL | Obtém o `id` do grupo que vem na rota (ex: `/grupo-detalhe/3`) |
| `modalController.create()` | Cria o modal | Define qual o componente a mostrar e que dados lhe passar |
| `componentProps` | Propriedades enviadas ao modal | Envia a lista de pessoas já no grupo para o modal |
| `modal.present()` | Abre o modal | Mostra o modal no ecrã |
| `modal.onDidDismiss()` | Aguarda o fecho | Espera que o utilizador feche o modal e recebe os dados devolvidos |
| `data` | Dados do modal | A lista de pessoas selecionadas no modal |

**Fluxo do `abrirModal()`:**
1. Cria o modal com a lista de pessoas já no grupo
2. Abre o modal
3. Espera que o utilizador feche (confirmando ou cancelando)
4. Se o utilizador confirmou (`data` tem pessoas), adiciona cada uma ao grupo no storage e na variável local

### HTML — `grupo-detalhe.page.html`

```html
<ion-header [translucent]="true">
  <ion-toolbar>
    <ion-buttons slot="start">
      <ion-back-button></ion-back-button>
    </ion-buttons>
    <ion-title>{{ grupo?.nome }}</ion-title>
  </ion-toolbar>
</ion-header>

<ion-content [fullscreen]="true">

  <h1 class="grupo-titulo">{{ grupo?.nome }}</h1>

  <div class="actions-row">
    <ion-button expand="block" fill="solid" class="btn-adicionar" (click)="abrirModal()">
      <ion-icon slot="start" name="person-add-outline"></ion-icon>
      Adicionar Utilizador
    </ion-button>
  </div>

  <div class="section-header">
    <span class="section-title">Membros</span>
    <span class="section-count">{{ grupo?.pessoas?.length }} Pessoas</span>
  </div>

  <ion-list lines="none">
    <ion-item *ngFor="let nome of grupo?.pessoas; let i = index">
      <ion-icon slot="start" name="person-circle-outline"></ion-icon>
      <ion-label>
        <h2>{{ nome }}</h2>
        <p>{{ i === 0 ? 'ADMINISTRADOR' : 'MEMBRO' }}</p>
      </ion-label>
    </ion-item>
  </ion-list>

  <div class="section-header">
    <span class="section-title">Produtos Partilhados</span>
    <a class="ver-todos">Ver Todos</a>
  </div>

  <ion-item lines="none" class="btn-mover">
    <ion-label>Mover Produto para Grupo</ion-label>
    <ion-icon slot="end" name="arrow-forward"></ion-icon>
  </ion-item>

  <ion-button expand="block" fill="outline" color="danger" class="btn-sair">
    <ion-icon slot="start" name="log-out-outline"></ion-icon>
    Sair do Grupo
  </ion-button>

</ion-content>
```

### Explicação do HTML

| Elemento | Para que serve |
|---|---|
| `{{ grupo?.nome }}` | Mostra o nome do grupo. O `?.` protege contra `undefined` |
| `(click)="abrirModal()"` | Liga o botão ao método TypeScript |
| `*ngFor="let nome of grupo?.pessoas; let i = index"` | Repete o `ion-item` para cada membro. `i` é o número da posição (0, 1, 2...) |
| `{{ i === 0 ? 'ADMINISTRADOR' : 'MEMBRO' }}` | Se for o primeiro (i=0) mostra "ADMINISTRADOR", senão "MEMBRO" |

---

## 5. Modal Selecionar Pessoa

### TypeScript — `selecionar-pessoa.page.ts`

```typescript
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

  constructor(private randomuserService: Randomuser, private modalController: ModalController) {}

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
```

### Explicação

| Elemento | O que é | Para que serve |
|---|---|---|
| `@Input() pessoasJaAdicionadas` | Decorador do Angular | Recebe dados do componente pai (o `grupo-detalhe`). Permite passar a lista de pessoas já no grupo |
| `pessoas` | Array | Guarda a lista completa da API (já sem os que estão no grupo) |
| `pessoasFiltradas` | Array | Lista que aparece no ecrã — muda conforme o que o utilizador escreve na pesquisa |
| `selecionadas` | Array | Lista das pessoas que o utilizador escolheu |
| `pesquisa` | String | Texto da barra de pesquisa, ligado com `[(ngModel)]` |
| `ngOnInit()` | Ciclo de vida | Carrega as pessoas da API e remove as que já estão no grupo |
| `filtrar()` | Método | Atualiza `pessoasFiltradas` com base no texto de pesquisa |
| `toggleSelecao()` | Método | Adiciona ou remove uma pessoa da lista `selecionadas` ao clicar |
| `cancelar()` | Método | Fecha o modal sem enviar dados |
| `confirmar()` | Método | Fecha o modal e envia a lista `selecionadas` para o `grupo-detalhe` |

**Porquê `dismiss(this.selecionadas)` no `confirmar()`?**
O `dismiss()` pode receber dados como argumento. Esses dados são recebidos no `grupo-detalhe` através do `modal.onDidDismiss()` como `{ data }`.

### HTML — `selecionar-pessoa.page.html`

```html
<ion-header>
  <ion-toolbar>
    <ion-title>Adicionar Pessoas</ion-title>
    <ion-buttons slot="end">
      <ion-button (click)="cancelar()">Cancelar</ion-button>
    </ion-buttons>
  </ion-toolbar>
</ion-header>

<ion-content>
  <ion-searchbar [(ngModel)]="pesquisa" (ionInput)="filtrar()" placeholder="Pesquisar..."></ion-searchbar>

  <ion-list>
    <ion-item *ngFor="let pessoa of pessoasFiltradas" (click)="toggleSelecao(pessoa)">
      <ion-avatar slot="start">
        <img [src]="pessoa.picture.thumbnail" />
      </ion-avatar>
      <ion-label>{{ pessoa.name.first }} {{ pessoa.name.last }}</ion-label>
      <ion-checkbox slot="end" [checked]="selecionadas.includes(pessoa)"></ion-checkbox>
    </ion-item>
  </ion-list>

  <ion-button expand="block" (click)="confirmar()">
    Adicionar ({{ selecionadas.length }})
  </ion-button>
</ion-content>
```

### Explicação do HTML

| Elemento | Para que serve |
|---|---|
| `[(ngModel)]="pesquisa"` | Liga o campo de texto à variável `pesquisa` em tempo real (two-way binding) |
| `(ionInput)="filtrar()"` | Chama `filtrar()` cada vez que o utilizador escreve |
| `*ngFor="let pessoa of pessoasFiltradas"` | Repete o item para cada pessoa na lista filtrada |
| `[src]="pessoa.picture.thumbnail"` | Mostra a foto da pessoa vinda da API |
| `[checked]="selecionadas.includes(pessoa)"` | A checkbox fica marcada se a pessoa estiver na lista `selecionadas` |
| `(click)="toggleSelecao(pessoa)"` | Ao clicar no item, adiciona ou remove a pessoa de `selecionadas` |
| `{{ selecionadas.length }}` | Mostra o número de pessoas selecionadas no botão |

---

## 6. Módulo do Detalhe do Grupo

**Ficheiro:** `src/app/grupo-detalhe/grupo-detalhe.module.ts`

```typescript
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { GrupoDetalhePageRoutingModule } from './grupo-detalhe-routing.module';
import { GrupoDetalhePage } from './grupo-detalhe.page';
import { SelecionarPessoaPage } from '../selecionar-pessoa/selecionar-pessoa.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GrupoDetalhePageRoutingModule
  ],
  declarations: [GrupoDetalhePage, SelecionarPessoaPage]
})
export class GrupoDetalhePageModule {}
```

### Explicação

Em Angular, cada componente tem de estar declarado num módulo. O `SelecionarPessoaPage` é usado como **modal** dentro do `GrupoDetalhePage`, por isso tem de estar declarado no **mesmo módulo**.

**Regra importante:** um componente só pode ser declarado num único módulo. Por isso foi removido do seu próprio módulo (`selecionar-pessoa.module.ts`) e declarado aqui.

| Import | Para que serve |
|---|---|
| `CommonModule` | Disponibiliza diretivas base como `*ngFor` e `*ngIf` |
| `FormsModule` | Necessário para `[(ngModel)]` (barra de pesquisa) |
| `IonicModule` | Disponibiliza todos os componentes Ionic (`ion-button`, `ion-list`, etc.) |

---

## Fluxo completo — Adicionar pessoa a um grupo

```
Utilizador abre um grupo
        ↓
grupo-detalhe carrega o grupo pelo id da URL
        ↓
Utilizador clica em "Adicionar Utilizador"
        ↓
abrirModal() é chamado
        ↓
Modal abre com componentProps: { pessoasJaAdicionadas: grupo.pessoas }
        ↓
SelecionarPessoaPage recebe a lista via @Input()
        ↓
ngOnInit carrega pessoas da API e filtra as que já estão no grupo
        ↓
Utilizador pesquisa e seleciona pessoas
        ↓
Utilizador clica "Adicionar (n)"
        ↓
confirmar() chama modalController.dismiss(selecionadas)
        ↓
onDidDismiss() recebe { data: selecionadas }
        ↓
Para cada pessoa: adicionarPessoa() guarda no storage
        ↓
grupo.pessoas.push(nome) atualiza o ecrã imediatamente
```