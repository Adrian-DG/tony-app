import { Routes } from '@angular/router';
import { LoginPage } from './login.page';

export const loginRoutes: Routes = [
	{
		path: '',
		loadComponent: () => import('./login.page').then((m) => m.LoginPage),
		title: 'Identificación',
	},
];
