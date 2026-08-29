import { Routes } from '@angular/router';
import { SplashPage } from './splash.page';

export const splashRoutes: Routes = [
	{
		path: '',
		loadComponent: () => import('./splash.page').then((m) => m.SplashPage),
		title: 'Bienvenido',
	},
];
