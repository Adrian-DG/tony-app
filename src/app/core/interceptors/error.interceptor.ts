import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { catchError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
	const errorDictionary: { [key: number]: string } = {
		401: 'Usuario no autorizado. Por favor, inicie sesión nuevamente.',
		403: 'Acceso denegado. No tiene permiso para acceder a este recurso.',
		404: 'Recurso no encontrado. La URL solicitada no existe.',
		500: 'Error interno del servidor. Por favor, inténtelo de nuevo más tarde.',
	};

	const alertCtrl = inject(AlertController);

	return next(req).pipe(
		catchError(async (error) => {
			const message =
				errorDictionary[error.status] ||
				'Ocurrió un error inesperado. Por favor, inténtelo de nuevo.';

			const alert = await alertCtrl.create({
				header: 'Error',
				message: message,
				buttons: ['OK'],
			});

			await alert.present();
			throw error;
		})
	);
};
