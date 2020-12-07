import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { ProfileComponent } from 'src/app/pages/profile/profile.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { AppComponent } from './app.component';
import { AuthGuard } from '@auth0/auth0-angular';
import { AnauthenticatedComponent } from './anauthenticated/anauthenticated.component';
import { AcceptableComponent } from './acceptable/acceptable.component';
import { TakedownComponent } from './takedown/takedown.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { TakedownworkflowComponent } from './takedownworkflow/takedownworkflow.component';
import { CommentsComponent } from './comments/comments.component';


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
  {
    path: 'takedownworkflow',
    component: TakedownworkflowComponent,
  },
  {
    path: 'comment',
    component: CommentsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
