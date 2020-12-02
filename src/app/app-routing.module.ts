import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from 'src/app/pages/home/home.component';
import { ExternalApiComponent } from 'src/app/pages/external-api/external-api.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthenticatedComponent } from './authenticated/authenticated.component';
import { AppComponent } from './app.component';

const routes: Routes = [
  { path: '', redirectTo: 'authenticated', pathMatch: 'full'},

  { path: 'authenticated', component: AuthenticatedComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'external-api',component: ExternalApiComponent,},
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
