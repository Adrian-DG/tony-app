import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePage } from './home.page';

const routes: Routes = [
	{
		path: '',
		component: HomePage,
		title: 'Inicio',
	},
	{
		path: 'stats',
		loadComponent: () =>
			import('./stats/stats.page').then((m) => m.StatsPage),
		title: 'Estadísticas',
	},
	{
		path: ':id',
		loadComponent: () =>
			import('./detail/detail.component').then((m) => m.DetailComponent),
		title: 'Detalles del Grupo',
	},
	{
		path: ':id/member-formulary',
		loadComponent: () =>
			import('./member-formulary/member-formulary.component').then(
				(m) => m.MemberFormularyComponent
			),
		title: 'Formulario de Miembro',
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class HomePageRoutingModule {}
