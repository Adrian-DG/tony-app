import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { from, switchMap } from 'rxjs';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
	const storage = inject(Storage);
	return from(storage.get('access_token')).pipe(
		switchMap((token) => {
			if (token) {
				req = req.clone({
					setHeaders: {
						Authorization: `Bearer ${token}`,
					},
				});
			}
			return next(req);
		})
	);
};
