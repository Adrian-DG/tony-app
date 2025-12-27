import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePage } from './home.page';

const routes: Routes = [
	{
		path: '',
		component: HomePage,
	},
	{
		path: ':id',
		loadComponent: () =>
			import('./detail/detail.component').then((m) => m.DetailComponent),
	},
	{
		path: ':id/member-formulary',
		loadComponent: () =>
			import('./member-formulary/member-formulary.component').then(
				(m) => m.MemberFormularyComponent
			),
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class HomePageRoutingModule {}
