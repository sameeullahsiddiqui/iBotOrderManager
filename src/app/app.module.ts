import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
// import {
//   MatToolbarModule,
//   MatMenuModule,
//   MatIconModule,
//   MatButtonModule,
//   MatTableModule,
//   MatDividerModule,
//   MatProgressSpinnerModule,
//   MatInputModule,
//   MatCardModule,
//   MatSlideToggleModule,
//   MatSelectModule,
//   MatOptionModule,
// } from '@angular/material';

import { TableModule } from 'primeng/table';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { KnobModule } from 'primeng/knob';
import { TagModule } from 'primeng/tag';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TabMenuModule } from 'primeng/tabmenu';
import { TabViewModule } from 'primeng/tabview';
import { TerminalModule } from 'primeng/terminal';

import { AppRoutingModule } from './app-routing.module';

import { OrdersService } from './shared/services/orders.service';
import { AppComponent } from './app.component';
import { StockOrderComponent } from './components/stock-order/stock-order.component';
import { StockAlertComponent } from './components/stock-alert/stock-alert.component';
import { UserConfigurationComponent } from './components/user-configuration/user-configuration.component';
import { TradingSignalComponent } from './components/trading-signal/trading-signal.component';

//environment import
import { environment } from 'src/environments/environment';

//angularfire imports
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { LocalStorageService } from './shared/services/local-storage.service';
import { HomeComponent } from './components/home/home.component';
import { ManageComponent } from './components/manage/manage.component';
import { ReleaseLogComponent } from './components/release-log/release-log.component';
import { ErrorInterceptor } from './helpers/error.interceptor';
import { JwtInterceptor } from './helpers/jwt.interceptor';
import { AuthService } from './shared/services/auth.service';
import { ZerodhaLoginComponent } from './components/zerodha-login/zerodha-login.component';
import { WatchListComponent } from './components/watch-list/watch-list.component';
import { MarketDepthComponent } from './components/market-depth/market-depth.component';

@NgModule({
  declarations: [
    AppComponent,
    StockOrderComponent,
    UserConfigurationComponent,
    StockAlertComponent,
    TradingSignalComponent,
    HomeComponent,
    ManageComponent,
    ReleaseLogComponent,
    ZerodhaLoginComponent,
    WatchListComponent,
    MarketDepthComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    // MatToolbarModule,
    // MatInputModule,
    // MatCardModule,
    // MatMenuModule,
    // MatIconModule,
    // MatButtonModule,
    // MatTableModule,
    // MatDividerModule,
    // MatSlideToggleModule,
    // MatSelectModule,
    // MatOptionModule,
    // MatProgressSpinnerModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
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
    TerminalModule,
  ],
  providers: [
    OrdersService,
    LocalStorageService,
    AuthService,
    // { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    // { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
