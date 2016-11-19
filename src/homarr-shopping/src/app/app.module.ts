import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AngularFireModule } from 'angularfire2';
import { firebaseConfig, authConfig } from '../environments/firebase-config';

import { Logger } from './shared/logging/logger.service';
import { ConsoleLogger } from './shared/logging/console-logger.service';

import { ItemService } from './items/item.service';

import { AppComponent } from './app.component';
import { ItemListComponent } from './items/item-list.component';
import { ItemLookupComponent } from './items/item-lookup.component';
import { AddItemComponent } from './items/add-item.component';
import { BarcodeScanner } from './shared/barcode-scanner.component';

@NgModule({
  declarations: [
    AppComponent,
    ItemListComponent,
    ItemLookupComponent,
    AddItemComponent,
    BarcodeScanner
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AngularFireModule.initializeApp(firebaseConfig, authConfig)
  ],
  providers: [
    {
      provide: Logger,
      useClass: ConsoleLogger
    },
    {
      provide: ItemService,
      useClass: ItemService
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
