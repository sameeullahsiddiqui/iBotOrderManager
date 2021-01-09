import { BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {TableModule} from 'primeng/table';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {ButtonModule} from 'primeng/button';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {DialogModule} from 'primeng/dialog';
import {InputNumberModule} from 'primeng/inputnumber';
import {RadioButtonModule} from 'primeng/radiobutton';
import {DropdownModule} from 'primeng/dropdown';
import {FileUploadModule} from 'primeng/fileupload';
import {ToolbarModule} from 'primeng/toolbar';
import {ToastModule} from 'primeng/toast';
import {HttpClientModule} from '@angular/common/http';
import {KnobModule} from 'primeng/knob';
import { TagModule } from 'primeng/tag';
import {InputSwitchModule} from 'primeng/inputswitch';
import {TabMenuModule} from 'primeng/tabmenu';
import {TabViewModule} from 'primeng/tabview';
import {TerminalModule} from 'primeng/terminal';


import { AppRoutingModule } from './app-routing.module';

import { OrdersService } from './shared/services/orders.service';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { StockOrderComponent } from './components/stock-order/stock-order.component';
import { StockAlertComponent } from './components/stock-alert/stock-alert.component';
import { UserConfigurationComponent } from './components/user-configuration/user-configuration.component';
import { TradingSignalComponent } from './components/trading-signal/trading-signal.component';

//environment import
import { environment } from 'src/environments/environment';

//angularfire imports
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { LocalStorageService } from './shared/services/local-storage.service';
import { HomeComponent } from './components/home/home.component';
import { ManageComponent } from './components/manage/manage.component';
import { ReleaseLogComponent } from './components/Releaselog/release-log.component';
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    StockOrderComponent,
    UserConfigurationComponent,
    StockAlertComponent,
    TradingSignalComponent,
    HomeComponent,
    ManageComponent,
    ReleaseLogComponent
    ] ,
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    TableModule,
    AutoCompleteModule,
    ButtonModule,
    ConfirmDialogModule,
    DialogModule,
    InputNumberModule,
    RadioButtonModule,
    DropdownModule,
    FileUploadModule,
    ToolbarModule,
    ToastModule,
    HttpClientModule,
    KnobModule,
    TagModule,
    TabMenuModule,
    InputSwitchModule,
    TabViewModule,
    TerminalModule
  ],
  providers: [OrdersService, LocalStorageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
