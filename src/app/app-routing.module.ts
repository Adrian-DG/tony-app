import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { authenticationGuard } from './core/guards/authentication.guard';
import { redirectAuthenticatedGuard } from './core/guards/redirect-authenticated.guard';
import { homeExitGuard } from './core/guards/home-exit.guard';

const routes: Routes = [
	{
		path: 'home',
		loadChildren: () =>
			import('./home/home.module').then((m) => m.HomePageModule),
		canActivate: [authenticationGuard],
	},
	{
		path: 'login',
		loadChildren: () =>
			import('./login/login.module').then((m) => m.LoginPageModule),
		canActivate: [redirectAuthenticatedGuard],
	},
	{
		path: '',
		pathMatch: 'full',
		loadChildren: () =>
			import('./splash/splash.module').then((m) => m.SplashPageModule),
		canActivate: [redirectAuthenticatedGuard],
	},
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
	],
	exports: [RouterModule],
})
export class AppRoutingModule {}
