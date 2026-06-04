import { Component } from '@angular/core';
import { NotificationService } from '../services/notification.service';
import { Product, ProductService } from '../services/product.service';

@Component({
  selector: 'app-notificacoes',
  templateUrl: './notificacoes.page.html',
  styleUrls: ['./notificacoes.page.scss'],
  standalone: false,
})

export class NotificacoesPage {

  emailSelected: boolean = false;
  pushSelected: boolean = false;

  public products: Product[] = [];

  constructor(
    private productService: ProductService,
    private notificationService: NotificationService
  ) { }

  async ionViewWillEnter() {
    this.products = await this.productService.getProducts();
    const settings = await this.notificationService.getSettings();
    this.emailSelected = settings.emailSelected;
    this.pushSelected = settings.pushSelected;
  }

  get allNotificationsEnabled(): boolean {
    return this.products.length > 0 && this.products.every(product => product.notications);
  }

  async onAllNotificationsToggle(event: CustomEvent) {
    const enabled = event.detail.checked;

    for (const product of this.products) {
      product.notications = enabled;
      await this.productService.updateProduct(product.id, {
        notications: enabled,
      });
    }
  }

  async onProductNotificationToggle(product: Product, event: CustomEvent) {
    const enabled = event.detail.checked;
    product.notications = enabled;

    await this.productService.updateProduct(product.id, {
      notications: enabled,
    });
  }

  async onEmailSelectedChange() {
    this.emailSelected = !this.emailSelected;
    await this.notificationService.updateSettings({
      emailSelected: this.emailSelected,
    });
  }

  async onPushSelectedChange() {
    this.pushSelected = !this.pushSelected;
    await this.notificationService.updateSettings({
      pushSelected: this.pushSelected,
    });
  }

}
