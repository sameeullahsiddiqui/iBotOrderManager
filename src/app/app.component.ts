import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {MenuItem} from 'primeng/api';
import { AuthService } from './shared/services/auth.service';
import { LocalStorageService } from './shared/services/local-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isAuthenticated: boolean = false;
  items: MenuItem[] = [];
  activeItem!: MenuItem;
  title = 'iBotMoneyManager';
  private readonly USERIDKEY = 'iBotUserId';
  private readonly MOBILEKEY = 'iBotUserMobile';
  userName: string | undefined;

  constructor(public authService: AuthService,
              public localStorageService: LocalStorageService,
              public router: Router) {
  }

  signOut() {
    this.localStorageService.clear();
    this.router.navigate(['/home'])
  }

  logout() {
    this.authService.SignOut();
  }


  ngOnInit() {
    this.isAuthenticated = this.authService.isLoggedIn;
    this.userName = this.localStorageService.getItem(this.USERIDKEY);

    this.items = [
        {label: 'Home', icon: 'pi pi-fw pi-home', routerLink: '/home'},
        {label: 'Manage', icon: 'pi pi-fw pi-shopping-cart', routerLink: '/manage'},
        // {label: 'Order', icon: 'pi pi-fw pi-shopping-cart', routerLink: '/orders'},
        // {label: 'Signal', icon: 'pi pi-fw pi-send', routerLink: '/signals'},
        // {label: 'Alert', icon: 'pi pi-fw pi-bell', routerLink: '/alerts'},
        {label: 'Settings', icon: 'pi pi-fw pi-cog', routerLink: '/userConfiguration'},
        {label: 'ReleaseLog', icon: 'pi pi-fw pi-cog', routerLink: '/releaseLog'}
    ];

    this.activeItem = this.items[0];
  }

activateMenu(menu: any){}

}
