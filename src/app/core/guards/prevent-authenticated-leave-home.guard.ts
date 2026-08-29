import { inject } from '@angular/core';
import {
	ActivatedRouteSnapshot,
	CanDeactivateFn,
	RouterStateSnapshot,
} from '@angular/router';
import { HomePage } from '../../home/home.page';
import { UserService } from '../services/user.service';

export const preventAuthenticatedLeaveHomeGuard: CanDeactivateFn<HomePage> = async (
	_component: HomePage,
	_currentRoute: ActivatedRouteSnapshot,
	_currentState: RouterStateSnapshot,
	nextState?: RouterStateSnapshot,
) => {
	if (nextState?.url?.startsWith('/home')) {
		return true;
	}

	const userService = inject(UserService);
	const isAuthenticated = await userService.isAuthenticated();

	if (isAuthenticated) {
		return false;
	}

	return true;
};
