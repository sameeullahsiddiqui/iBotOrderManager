import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { StockOrderComponent } from './components/stock-order/stock-order.component';
import { StockAlertComponent } from './components/stock-alert/stock-alert.component';
import { UserConfigurationComponent } from './components/user-configuration/user-configuration.component';
import { TradingSignalComponent } from './components/trading-signal/trading-signal.component';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent},
  { path: 'orders', component: StockOrderComponent},
  { path: 'alerts', component: StockAlertComponent},
  { path: 'signals', component: TradingSignalComponent},
  { path: 'userConfiguration', component: UserConfigurationComponent},
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
