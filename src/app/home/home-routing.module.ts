import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { homeExitGuard } from '../core/guards/home-exit.guard';

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
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class HomePageRoutingModule {}
