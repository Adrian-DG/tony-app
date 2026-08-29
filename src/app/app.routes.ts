import { Routes } from '@angular/router';
import { authenticationGuard } from './core/guards/authentication.guard';

export const appRoutes: Routes = [
	{
		path: 'home',
		loadChildren: () =>
			import('./home/home.routes').then((m) => m.homeRoutes),
		canActivate: [authenticationGuard],
	},
	{
		path: 'login',
		loadChildren: () =>
			import('./login/login.routes').then((m) => m.loginRoutes),
	},
	{
		path: '',
		pathMatch: 'full',
		loadChildren: () =>
			import('./splash/splash.routes').then((m) => m.splashRoutes),
	},
];
