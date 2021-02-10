import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StockOrderComponent } from './components/stock-order/stock-order.component';
import { StockAlertComponent } from './components/stock-alert/stock-alert.component';
import { UserConfigurationComponent } from './components/user-configuration/user-configuration.component';
import { TradingSignalComponent } from './components/trading-signal/trading-signal.component';
import { HomeComponent } from './components/home/home.component';
import { ManageComponent } from './components/manage/manage.component';
import { ReleaseLogComponent } from './components/release-log/release-log.component';
import { AuthGuard } from './shared/guard/auth.guard';
import { ZerodhaLoginComponent } from './components/zerodha-login/zerodha-login.component';
import { WatchListComponent } from './components/watch-list/watch-list.component';

const adminsModule = () => import('./admin/admin.module').then(x => x.AdminModule);

const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'zerodha-login', component: ZerodhaLoginComponent},
  { path: 'home', component: HomeComponent},
  { path: 'manage', component: ManageComponent, canActivate: [AuthGuard] },
  { path: 'orders', component: StockOrderComponent, canActivate: [AuthGuard] },
  { path: 'alerts', component: StockAlertComponent, canActivate: [AuthGuard] },
  { path: 'watchlist', component: WatchListComponent, canActivate: [AuthGuard] },
  { path: 'signals', component: TradingSignalComponent, canActivate: [AuthGuard] },
  { path: 'releaseLog', component: ReleaseLogComponent, canActivate: [AuthGuard] },
  { path: 'userConfiguration', component: UserConfigurationComponent, canActivate: [AuthGuard]},
   // otherwise redirect to home
   { path: 'admin', loadChildren: adminsModule},
   { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
