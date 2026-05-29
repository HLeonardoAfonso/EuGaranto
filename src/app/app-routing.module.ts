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
    path: 'criargrupo',
    loadChildren: () => import('./criargrupo/criargrupo.module').then( m => m.CriargrupoPageModule)
  },
  {
    path: 'grupo-detalhe/:id',
    loadChildren: () => import('./grupo-detalhe/grupo-detalhe.module').then( m => m.GrupoDetalhePageModule)
  }

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
