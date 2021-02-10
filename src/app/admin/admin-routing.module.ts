import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from '../components/home/home.component';
import { AuthGuard } from '../shared/guard/auth.guard';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LayoutComponent } from './layout.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';

const routes: Routes = [
    {
        path: '', component: LayoutComponent,
        children: [
          { path: '', component: HomeComponent, canActivate: [AuthGuard] },
          { path: 'sign-in', component: SignInComponent},
          { path: 'register-user', component: SignUpComponent},
          { path: 'forgot-password', component: ForgotPasswordComponent },
          { path: 'verify-email-address', component: VerifyEmailComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule { }
