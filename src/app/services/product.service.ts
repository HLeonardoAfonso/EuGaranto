import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';

const PRODUCTS_STORAGE_KEY = '_garantiasdb';

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
    const stored = await this.storage.get(PRODUCTS_STORAGE_KEY);
    if (stored && stored.length > 0) {
      this.products = stored.map((product: Product) => ({
        ...product,
        dataCompra: new Date(product.dataCompra),
      }));
    }
    return [...this.products];
  }

  async getProductById(id: number): Promise<Product | undefined> {
    console.log('[ProductService] getProductById called with id:', id);
    const products = await this.getProducts();
    console.log('[ProductService] products found:', products.length, products.map(p => ({ id: p.id, nome: p.nome })));
    const found = products.find(prod => prod.id === id);
    console.log('[ProductService] product found:', found);
    return found;
  }

  async addProduct(product: Omit<Product, 'id'>): Promise<Product> {
    const products = await this.getProducts();
    const maxId = products.reduce((max, p) => Math.max(max, p.id), 0);
    const newProduct: Product = {
      ...product,
      id: maxId + 1
    };
    products.push(newProduct);
    this.products = products;
    await this.storage.set(PRODUCTS_STORAGE_KEY, this.products);
    return newProduct;
  }

  async updateProduct(id: number, updates: Partial<Omit<Product, 'id'>>): Promise<Product | undefined> {
    const products = await this.getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return undefined;

    products[index] = {
      ...products[index],
      ...updates,
      dataCompra: new Date(updates.dataCompra ?? products[index].dataCompra),
    };
    this.products = products;
    await this.storage.set(PRODUCTS_STORAGE_KEY, this.products);
    return products[index];
  }

  async deleteProduct(id: number): Promise<boolean> {
    const products = await this.getProducts();
    const filteredProducts = products.filter(p => p.id !== id);

    if (filteredProducts.length === products.length) {
      return false;
    }

    this.products = filteredProducts;
    await this.storage.set(PRODUCTS_STORAGE_KEY, this.products);
    return true;
  }

}
