import { Component, OnInit } from '@angular/core';
import {
	FormBuilder,
	FormGroup,
	ReactiveFormsModule,
	Validators,
	AsyncValidatorFn,
	AbstractControl,
	ValidationErrors,
} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {
	MaskitoOptions,
	MaskitoElementPredicate,
	maskitoTransform,
} from '@maskito/core';
import { MaskitoDirective } from '@maskito/angular';
import { UserService } from '../core/services/user.service';
import { ILoginUserDTO } from '../core/dto/user/ilogin-user.dto';
import { Router } from '@angular/router';
import { Observable, of, timer } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

@Component({
	selector: 'app-login',
	imports: [IonicModule, ReactiveFormsModule],
	templateUrl: './login.page.html',
	styleUrls: ['./login.page.scss'],
	providers: [UserService],
})
export class LoginPage implements OnInit {
	loginForm: FormGroup;

	// Field error configurations
	fieldErrors = {
		identification: {
			required: 'Cédula es requerida',
			minlength: 'Cédula debe tener al menos 11 caracteres',
			maxlength: 'Cédula debe tener máximo 11 caracteres',
			pattern: 'Formato de cédula inválido',
			identificationInvalid: 'Cédula no existe en el sistema',
			identificationUsed: 'Esta cédula ya está registrada',
		},
		phone_number: {
			required: 'Número de teléfono es requerido',
			minlength: 'Número de teléfono debe tener al menos 10 dígitos',
			pattern: 'Formato de teléfono inválido',
			phoneInvalid: 'Número de teléfono no válido',
			phoneUsed: 'Este teléfono ya está registrado',
		},
	};

	// readonly identificationMask: MaskitoOptions = {
	// 	mask: [
	// 		/\d/,
	// 		/\d/,
	// 		/\d/,
	// 		'-',
	// 		/\d/,
	// 		/\d/,
	// 		/\d/,
	// 		/\d/,
	// 		/\d/,
	// 		/\d/,
	// 		/\d/,
	// 		'-',
	// 		/\d/,
	// 	],
	// };

	// Remove this line as it might cause conflicts
	// identificationMaskedValue = maskitoTransform(
	// 	'00000000000',
	// 	this.identificationMask
	// );

	// readonly identificationPredicate: MaskitoElementPredicate = async (
	// 	element
	// ) => {
	// 	// Add a small delay to ensure the DOM is ready
	// 	await new Promise((resolve) => setTimeout(resolve, 100));

	// 	// Try to find the element by ID first, then fallback to other selectors
	// 	const inputElement =
	// 		document.getElementById('identification-input') ||
	// 		element.querySelector('input') ||
	// 		element.querySelector('ion-input input') ||
	// 		element.querySelector('[part="native"]');

	// 	// Return the input element if found, otherwise return the original element
	// 	return (
	// 		(inputElement as HTMLInputElement) || (element as HTMLInputElement)
	// 	);
	// };

	constructor(
		private fb: FormBuilder,
		private userService: UserService,
		private router: Router
	) {
		this.loginForm = this.fb.group({
			identification: [
				'',
				[
					Validators.required,
					Validators.minLength(11),
					Validators.maxLength(11),
					Validators.pattern(/^\d{11}$/),
				],
			],
			phone_number: [
				'',
				[
					Validators.required,
					Validators.minLength(10),
					Validators.pattern(/^\d+$/),
				],
			],
		});
	}

	ngOnInit() {}

	// Get error messages for a specific field
	getFieldErrors(fieldName: string): string[] {
		const field = this.loginForm.get(fieldName);
		const errors: string[] = [];

		if (field && field.touched && field.invalid && field.errors) {
			Object.keys(field.errors).forEach((errorType) => {
				const fieldErrorConfig =
					this.fieldErrors[
						fieldName as keyof typeof this.fieldErrors
					];
				const errorMessage =
					fieldErrorConfig[
						errorType as keyof typeof fieldErrorConfig
					];

				if (errorMessage) {
					errors.push(errorMessage);
				}
			});
		}

		return errors;
	}

	onLogin() {
		if (this.loginForm.valid) {
			console.log('Login successful', this.loginForm.value);
			const { identification, phone_number } = this.loginForm.value;
			const payload: ILoginUserDTO = {
				identification: identification,
				phone_number: phone_number,
			};
			this.userService.loginUser(payload);
		}
	}
}
