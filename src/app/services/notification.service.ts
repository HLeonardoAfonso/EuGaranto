import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

const NOTIFICATION_SETTINGS_STORAGE_KEY = '_notificationSettings';

export interface NotificationSettings {
  emailSelected: boolean;
  pushSelected: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private settings: NotificationSettings = {
    emailSelected: false,
    pushSelected: false,
  };

  constructor(private storage: Storage) {}

  async getSettings(): Promise<NotificationSettings> {
    const stored = await this.storage.get(NOTIFICATION_SETTINGS_STORAGE_KEY);

    if (stored) {
      this.settings = {
        ...this.settings,
        ...stored,
      };
    }

    return { ...this.settings };
  }

  async updateSettings(updates: Partial<NotificationSettings>): Promise<NotificationSettings> {
    const current = await this.getSettings();
    this.settings = {
      ...current,
      ...updates,
    };

    await this.storage.set(NOTIFICATION_SETTINGS_STORAGE_KEY, this.settings);
    return { ...this.settings };
  }
}
