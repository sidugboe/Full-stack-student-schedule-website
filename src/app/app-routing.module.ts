import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { ProfileComponent } from 'src/app/pages/profile/profile.component';
import { ExternalApiComponent } from 'src/app/pages/external-api/external-api.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { AppComponent } from './app.component';
import { AuthGuard } from '@auth0/auth0-angular';
import { AnauthenticatedComponent } from './anauthenticated/anauthenticated.component';
import { AcceptableComponent } from './acceptable/acceptable.component';
import { TakedownComponent } from './takedown/takedown.component';
import { PrivacyComponent } from './privacy/privacy.component'




const routes: Routes = [
  { path: '', redirectTo: '', pathMatch: 'full'},

  {
    path: 'anauthenticated',
    component: AnauthenticatedComponent,
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'external-api',
    component: ExternalApiComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'acceptablepolicy',
    component: AcceptableComponent,
  },
  {
    path: 'takedownpolicy',
    component: TakedownComponent,
  },
  {
    path: 'privacy',
    component: PrivacyComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
