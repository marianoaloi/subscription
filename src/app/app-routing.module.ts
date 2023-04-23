import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { BrowserUtils } from '@azure/msal-browser';
import { HomeComponent } from './home/home.component';
import { ResourceGroupComponent } from './resource-group/resource-group.component';

const routes: Routes = [
  {
    path: 'rg',
    component: ResourceGroupComponent,
    canActivate: [MsalGuard],
  },
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'auth',
    component: HomeComponent,
  },
  {
    // Needed for Error routing
    path: 'error',
    component: HomeComponent,
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      // Don't perform initial navigation in iframes or popups
      initialNavigation:
        !BrowserUtils.isInIframe() && !BrowserUtils.isInPopup()
          ? 'enabledNonBlocking'
          : 'disabled', // Set to enabledBlocking to use Angular Universal
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
