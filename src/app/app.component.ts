import { Component } from '@angular/core';
import {MenuItem} from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  items: MenuItem[] = [];
  activeItem!: MenuItem;

  title = 'iBotMoneyManager';
  ngOnInit() {
    this.items = [
        {label: 'Home', icon: 'pi pi-fw pi-home', routerLink: '/home'},
        {label: 'Order', icon: 'pi pi-fw pi-shopping-cart', routerLink: '/orders'},
        // {label: 'Signal', icon: 'pi pi-fw pi-send', routerLink: '/signals'},
        {label: 'Alert', icon: 'pi pi-fw pi-bell', routerLink: '/alerts'},
        {label: 'Settings', icon: 'pi pi-fw pi-cog', routerLink: '/userConfiguration'}
    ];

    this.activeItem = this.items[0];
}

activateMenu(menu: any){

}

}
