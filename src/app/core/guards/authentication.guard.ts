import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { UserService } from '../services/user.service';

export const authenticationGuard: CanActivateFn = () => {
	const authService = inject(UserService);
	const isAuthenticated = authService.isAuthenticated$();
	if (!isAuthenticated) {
		authService.redirectToLogin();
		return false;
	}
	return true;
};
