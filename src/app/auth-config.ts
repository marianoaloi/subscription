/**
 * This file contains authentication parameters. Contents of this file
 * is roughly the same across other MSAL.js libraries. These parameters
 * are used to initialize Angular and MSAL Angular configurations in
 * in app.module.ts file.
 */

import { LogLevel, Configuration, BrowserCacheLocation } from '@azure/msal-browser';
import { environment } from 'src/environments/environment';
const isIE = window.navigator.userAgent.indexOf("MSIE ") > -1 || window.navigator.userAgent.indexOf("Trident/") > -1;

/**
 * Configuration object to be passed to MSAL instance on creation.
 * For a full list of MSAL.js configuration parameters, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md
 */
export const msalConfig: Configuration = {
    auth: {
        clientId: environment.appClientId, // This is the ONLY mandatory field that you need to supply.
        authority: 'https://login.microsoftonline.com/7893571b-6c2c-4cef-b4da-7d4b266a0626', // Defaults to "https://login.microsoftonline.com/common"
        redirectUri: environment.redirectUri, // Points to window.location.origin. You must register this URI on Azure portal/App Registration.
        // postLogoutRedirectUri: '/', // Indicates the page to navigate after logout.
        // navigateToLoginRequestUrl: true, // If "true", will navigate back to the original request location before processing the auth code response.
    },
    cache: {
        cacheLocation: BrowserCacheLocation.LocalStorage, // Configures cache location. "sessionStorage" is more secure, but "localStorage" gives you SSO between tabs.
        storeAuthStateInCookie: isIE, // Set this to "true" if you are having issues on IE11 or Edge
    },
    system: {
        loggerOptions: {
            loggerCallback(logLevel: LogLevel, message: string) {
                console.log(message);
            },
            logLevel: LogLevel.Info,
            piiLoggingEnabled: false
        }
    }
}

/**
 * Add here the endpoints and scopes when obtaining an access token for protected web APIs. For more information, see:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/resources-and-scopes.md
 */
 export const protectedResources = {
  operation: {
    endpoint: 'https://management.azure.com',
    scopes: ['https://management.azure.com/user_impersonation'],
  },
}

/**
 * An optional silentRequest object can be used to achieve silent SSO
 * between applications by providing a "login_hint" property.
 */
export const silentRequest = {
    scopes: ["openid", "profile"],
    loginHint: "example@domain.net"
};
