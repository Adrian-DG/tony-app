import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';

export const authenticationGuard: CanActivateFn = async () => {
	const authService = inject(UserService);
	const isAuthenticated = await authService.isAuthenticated$();
	if (!isAuthenticated) {
		authService.redirectToLogin();
		return false;
	}
	return true;
};
