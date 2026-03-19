import { Routes } from '@angular/router';
import { HomePage } from './home.page';

export const homeRoutes: Routes = [
	{
		path: 'users',
		loadComponent: () =>
			import('./user-group-form/user-group-form.component').then(
				(m) => m.UserGroupFormComponent,
			),
		title: 'Gestión de Usuarios',
	},
	{
		path: 'stats',
		loadComponent: () =>
			import('./stats/stats.page').then((m) => m.StatsPage),
		title: 'Estadísticas',
	},
	{
		path: ':id/member-formulary',
		loadComponent: () =>
			import('./member-formulary/member-formulary.component').then(
				(m) => m.MemberFormularyComponent,
			),
		title: 'Formulario de Miembro',
	},
	{
		path: ':id',
		loadComponent: () =>
			import('./detail/detail.component').then((m) => m.DetailComponent),
		title: 'Detalles del Grupo',
		data: { group_name: '', city_name: '' },
	},
	{
		path: '',
		pathMatch: 'full',
		loadComponent: () => import('./home.page').then((m) => m.HomePage),
		title: 'Inicio',
	},
];
