import { Component } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { ScreenOrientation } from '@capacitor/screen-orientation';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(private storage: Storage) {
    this.initStorage();
    this.lockOrientation();
  }

  async initStorage() {
    await this.storage.create();
  }

  // orientação do ecrã para portrait (retrato),
  private async lockOrientation() {
    await ScreenOrientation.lock({ orientation: 'portrait' });
  }
}
