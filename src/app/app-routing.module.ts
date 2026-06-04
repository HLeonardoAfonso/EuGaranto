import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'new-product/:id',
    loadChildren: () => import('./new-product/new-product.module').then( m => m.NewProductPageModule)
  },
  {
    path: 'notificacoes',
    loadChildren: () => import('./notificacoes/notificacoes.module').then( m => m.NotificacoesPageModule)
  },
  {
    path: 'criargrupo',
    loadChildren: () => import('./criargrupo/criargrupo.module').then( m => m.CriargrupoPageModule)
  },
  {
    path: 'grupo-detalhe/:id',
    loadChildren: () => import('./grupo-detalhe/grupo-detalhe.module').then( m => m.GrupoDetalhePageModule)
  },
  {
    path: 'edit-product/:id',
    loadChildren: () => import('./tab2/tab2.module').then( m => m.Tab2PageModule)
  },
  {
    path: 'selecionar-pessoa',
    loadChildren: () => import('./selecionar-pessoa/selecionar-pessoa.module').then( m => m.SelecionarPessoaPageModule)
  },
  {
    path: 'selecionar-produto',
    loadChildren: () => import('./selecionar-produto/selecionar-produto.module').then( m => m.SelecionarProdutoPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
