import {
	ApplicationConfig,
	importProvidersFrom,
	isDevMode,
	provideZoneChangeDetection,
} from '@angular/core';
import {
	PreloadAllModules,
	RouteReuseStrategy,
	provideRouter,
	withPreloading,
} from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { appRoutes } from './app.routes';
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
			return storage.get('access_token');
		},
	};
}

export const appConfig: ApplicationConfig = {
	providers: [
		provideZoneChangeDetection({ eventCoalescing: true }),
		provideRouter(appRoutes, withPreloading(PreloadAllModules)),
		{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
		provideHttpClient(withInterceptors([jwtInterceptor, errorInterceptor])),
		provideCharts(withDefaultRegisterables()),
		importProvidersFrom(
			IonicModule.forRoot(),
			IonicStorageModule.forRoot({
				driverOrder: [
					Drivers.IndexedDB,
					Drivers.LocalStorage,
					Drivers.SecureStorage,
				],
				name: '__voter_app_db',
				description: 'Voter App Ionic storage database',
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
				registrationStrategy: 'registerWhenStable:30000',
			}),
		),
	],
};
