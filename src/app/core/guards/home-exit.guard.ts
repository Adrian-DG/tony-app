import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { UserService } from '../services/user.service';

export const homeExitGuard: CanDeactivateFn<any> = () => {
	const userService = inject(UserService);
	const isAuthenticated = userService.isAuthenticated$();

	// If user is authenticated, prevent them from leaving home routes
	if (isAuthenticated) {
		return false;
	}

	// If not authenticated, allow navigation
	return true;
};
