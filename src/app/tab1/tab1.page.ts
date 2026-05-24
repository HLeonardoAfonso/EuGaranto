import { Component } from '@angular/core';
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
export class Tab1Page {
  public appPages = this.productService.getProducts();
  groupedProducts: ProductGroup[];

  constructor(private productService: ProductService) {
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


