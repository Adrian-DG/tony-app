import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';

export const redirectAuthenticatedGuard: CanActivateFn = () => {
	const authService = inject(UserService);
	const router = inject(Router);
	const isAuthenticated = authService.isAuthenticated$();

	if (isAuthenticated) {
		router.navigate(['/home']);
		return false;
	}

	return true;
};
