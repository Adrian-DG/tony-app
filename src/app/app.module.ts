import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import {
	HttpClientModule,
	provideHttpClient,
	withInterceptors,
} from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { IonicStorageModule } from '@ionic/storage-angular';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';
import { Storage } from '@ionic/storage-angular';
import { jwtInterceptor } from './core/interceptors/jwt.interceptor';
import { Drivers } from '@ionic/storage';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { ServiceWorkerModule } from '@angular/service-worker';

// Factory function to retrieve the token from storage
export function jwtOptionsFactory(storage: Storage) {
	return {
		tokenGetter: () => {
			return storage.get('access_token'); // The key where you store your JWT
		},
		// Optional: Add domains to which the token should be sent
		// allowedDomains: ['your-api-domain.com'],
		// disallowedRoutes: ['your-api-domain.com'], // Optional: Routes that don't need the token
	};
}

@NgModule({
	declarations: [AppComponent],
	imports: [
		BrowserModule,
		IonicModule.forRoot(),
		AppRoutingModule,
		HttpClientModule,
		IonicStorageModule.forRoot({
			driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage],
			name: '__mydb',
			description: 'my Ionic storage database',
			storeName: 'keyvaluepairs',
		}),
		JwtModule.forRoot({
			jwtOptionsProvider: {
				provide: JWT_OPTIONS,
				useFactory: jwtOptionsFactory,
				deps: [Storage],
			},
		}),
  ServiceWorkerModule.register('ngsw-worker.js', {
    enabled: !isDevMode(),
    // Register the ServiceWorker as soon as the application is stable
    // or after 30 seconds (whichever comes first).
    registrationStrategy: 'registerWhenStable:30000'
  }),
	],
	providers: [
		{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
		provideHttpClient(withInterceptors([jwtInterceptor, errorInterceptor])),
		provideCharts(withDefaultRegisterables()),
	],
	bootstrap: [AppComponent],
})
export class AppModule {}
