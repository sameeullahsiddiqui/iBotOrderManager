import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';

@Component({ templateUrl: 'layout.component.html' })
export class LayoutComponent {
    constructor(
        private router: Router,
        private authService: AuthService
    ) {
        // redirect to home if already logged in
        if (this.authService.isLoggedIn) {
            this.router.navigate(['/']);
        }
    }
}
