import { Injectable } from '@angular/core';

export interface Product {
  id: number;
  nome: string;
  marca: string;
  modelo: string;
  dataCompra: Date;
  duracaoGarantia: number; // warranty duration in months
  statusValido: boolean;
  notications: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: Product[] = [
    {
      id: 1,
      nome: 'Aspirador',
      marca: 'Philco',
      modelo: 'ASP-1234',
      dataCompra: new Date('2025-01-15'),
      duracaoGarantia: 24,
      statusValido: true,
      notications: false
    },
    {
      id: 2,
      nome: 'TV',
      marca: 'Samsung',
      modelo: 'UN55T7000',
      dataCompra: new Date('2025-10-01'),
      duracaoGarantia: 12,
      statusValido: true,
      notications: false
    },
  ];

  constructor() {}

  getProducts() {
    return this.products;
  }

  getProductById(id: number) {
    return this.products.find(p => p.id === id);
  }
}