import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IPublicClientApplication, PublicClientApplication, InteractionType } from '@azure/msal-browser';
import { MsalGuard, MsalBroadcastService, MsalModule, MsalService, MSAL_GUARD_CONFIG, MSAL_INSTANCE, MsalGuardConfiguration, MsalRedirectComponent, MSAL_INTERCEPTOR_CONFIG, MsalInterceptorConfiguration, MsalInterceptor } from '@azure/msal-angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { msalConfig, protectedResources } from './auth-config';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import {MatDialogModule} from '@angular/material/dialog';


import { HomeComponent } from './home/home.component';
import { ResourceGroupComponent } from './resource-group/resource-group.component';

export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication(msalConfig);
}
/**
 * Set your default interaction type for MSALGuard here. If you have any
 * additional scopes you want the user to consent upon login, add them here as well.
 */
export function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect,
    authRequest: {
      scopes: Object.entries(protectedResources).flatMap(x=>x[1].scopes) ,
    },
  };
}
export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const protectedResourceMap = new Map<string, Array<string>>();
  Object.entries(protectedResources).forEach(
    x=>protectedResourceMap.set(x[1].endpoint, x[1].scopes)
  )
  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap
  };
}
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ResourceGroupComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MsalModule,
    BrowserAnimationsModule,
    
    MatButtonModule,
    MatToolbarModule,
    MatListModule,
    MatDialogModule,

      // PivotTable,
  
    
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true,
    },
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory,
    },
    {
      provide: MSAL_GUARD_CONFIG,
      useFactory: MSALGuardConfigFactory,
    },
    {
      provide: MSAL_INTERCEPTOR_CONFIG,
      useFactory: MSALInterceptorConfigFactory,
    },
    MsalService,
    MsalGuard,
    MsalBroadcastService,
  ],
  bootstrap: [AppComponent, MsalRedirectComponent],
})
export class AppModule { }
