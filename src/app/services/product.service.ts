import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';

export interface Product {
  id: number;
  nome: string;
  marca: string;
  modelo: string;
  dataCompra: Date;
  duracaoGarantia: number; // warranty duration in months
  fotoFatura?: string;
  fotoLocal?: string;
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
    {
      id: 3,
      nome: 'Telemóvel',
      marca: 'Xiaomi',
      modelo: 'Redmi Note 12',
      dataCompra: new Date('2024-02-20'),
      duracaoGarantia: 24,
      statusValido: true,
      notications: false
    },
    {
      id: 4,
      nome: 'Micro-ondas',
      marca: 'LG',
      modelo: 'MS-2042B',
      dataCompra: new Date('2025-06-10'),
      duracaoGarantia: 12,
      statusValido: true,
      notications: false
    },
  ];

  constructor(private storage: Storage) {}

  async getProducts(): Promise<Product[]> {
    const products = await this.storage.get('_garantiasdb');
    return products || this.products;
  }

  async getProductById(id: number): Promise<Product | undefined> {
    const products = await this.getProducts();
    return products.find(prod => prod.id === id);
  }

  async addProduct(product: Omit<Product, 'id'>): Promise<Product> {
    const maxId = this.products.reduce((max, p) => Math.max(max, p.id), 0);
    const newProduct: Product = {
      ...product,
      id: maxId + 1
    };
    this.products.push(newProduct);
    await this.storage.set('_garantiasdb', this.products);
    return newProduct;
  }
}
