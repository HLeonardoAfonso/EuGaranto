import { Component, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Product, ProductService } from '../services/product.service';

export interface ProductGroup {
  year: number;
  products: Product[];
}

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page implements OnDestroy {
  public appPages: Product[] = [];
  groupedProducts: ProductGroup[] = [];

  private routerSubscription: any;

  constructor(
    private productService: ProductService,
    private router: Router
  ) {
    this.routerSubscription = this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd && event.url.includes('/tabs/tab1')) {
        this.loadProducts();
      }
    });
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  private async loadProducts() {
    console.log('[Tab1] Reloading products');
    this.appPages = await this.productService.getProducts();
    console.log('[Tab1] products loaded:', this.appPages.length);
    this.groupedProducts = this.buildGroupedProducts();
  }

  private buildGroupedProducts(): ProductGroup[] {
    const sorted = [...this.appPages].sort((a, b) =>
      b.dataCompra.getTime() - a.dataCompra.getTime()
    );

    const groups: ProductGroup[] = [];
    let currentYear = 0;

    for (const product of sorted) {
      const year = product.dataCompra.getFullYear();
      if (year !== currentYear) {
        currentYear = year;
        groups.push({ year, products: [] });
      }
      groups[groups.length - 1].products.push(product);
    }

    return groups;
  }
}