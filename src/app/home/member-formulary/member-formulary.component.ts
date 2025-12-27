import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
	Form,
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { IonInputCustomEvent, InputInputEventDetail } from '@ionic/core';
import { debounceTime, distinctUntilChanged, switchMap, map } from 'rxjs';
import { ICreateMemberGroupDto } from 'src/app/core/dto/member/icreate-member-group.dto';
import { MemberService } from 'src/app/core/services/member.service';

@Component({
	selector: 'app-member-formulary',
	imports: [IonicModule, ReactiveFormsModule],
	template: `
		<ion-header>
			<ion-toolbar color="secondary">
				<ion-buttons slot="start">
					<ion-back-button></ion-back-button>
				</ion-buttons>
				<ion-title>Formulario Afiliación</ion-title>
			</ion-toolbar>
		</ion-header>
		<ion-content class="ion-padding">
			<form [formGroup]="memberForm">
				<ion-list style="width: 80%; margin: auto; margin-top: 30%;">
					<ion-list-header>
						<div class="column">
							<ion-label>
								<h1>Datos del Miembro</h1>
							</ion-label>
							<ion-label>
								<p>
									Por favor, complete el siguiente formulario
									para agregar un nuevo miembro.
								</p>
							</ion-label>
						</div>
					</ion-list-header>
					<ion-item [lines]="'none'">
						<ion-input
							type="text"
							label="Identificación"
							labelPlacement="floating"
							formControlName="identification"
							[counter]="true"
							[maxlength]="11"
							[class.ion-invalid]="
								isFieldInvalid('identification') ||
								identificationExists
							"
							[class.ion-valid]="
								isFieldAsyncValid('identification') &&
								!identificationExists &&
								memberForm.get('identification')?.valid
							"
							[class.ion-touched]="
								memberForm.get('identification')?.touched
							"
							(ionInput)="
								onNumericInput($event, 'identification')
							"
						></ion-input>
						@if (getFieldValidationIcon('identification') ||
						isValidatingIdentification || identificationExists) {
						<ion-icon
							slot="end"
							[name]="
								isValidatingIdentification
									? 'time-outline'
									: identificationExists
									? 'alert-circle'
									: getFieldValidationIcon('identification')
							"
							[color]="
								isValidatingIdentification
									? 'medium'
									: identificationExists
									? 'danger'
									: getFieldValidationColor('identification')
							"
						></ion-icon>
						}
					</ion-item>
					@if (isFieldInvalid('identification') &&
					!identificationExists) {
					<ion-text color="danger">
						<small
							style="margin-left: 16px; display: block; margin-top: 4px;"
							>{{ getFieldErrorMessage('identification') }}</small
						>
					</ion-text>
					} @if (identificationExists && !isValidatingIdentification)
					{
					<ion-text color="danger">
						<small
							style="margin-left: 16px; display: block; margin-top: 4px; font-weight: 500; line-height: 1.4;"
						>
							<ion-icon
								name="close-circle"
								style="font-size: 14px; margin-right: 6px; vertical-align: text-top;"
							></ion-icon>
							{{ getIdentificationExistsMessage() }}
						</small>
					</ion-text>
					} @if (isIdentificationValid()) {
					<ion-text color="success">
						<small
							style="margin-left: 16px; display: block; margin-top: 4px; font-weight: 500;"
						>
							<ion-icon
								name="checkmark-circle"
								style="font-size: 12px; margin-right: 4px; vertical-align: text-top;"
							></ion-icon>
							Cédula disponible para registro
						</small>
					</ion-text>
					} @if (isValidatingIdentification) {
					<ion-text color="medium">
						<small
							style="margin-left: 16px; display: block; margin-top: 4px;"
						>
							<ion-icon
								name="time-outline"
								style="font-size: 12px; margin-right: 4px; vertical-align: text-top;"
							></ion-icon>
							Verificando cédula...
						</small>
					</ion-text>
					}
					<ion-item>
						<ion-input
							type="text"
							label="Nombre"
							labelPlacement="floating"
							formControlName="name"
							[disabled]="isValidatingIdentification"
							[class.ion-invalid]="isFieldInvalid('name')"
							[class.ion-valid]="isFieldAsyncValid('name')"
							[class.ion-touched]="
								memberForm.get('name')?.touched
							"
						></ion-input>
						@if (getFieldValidationIcon('name')) {
						<ion-icon
							slot="end"
							[name]="getFieldValidationIcon('name')"
							[color]="getFieldValidationColor('name')"
						></ion-icon>
						}
					</ion-item>
					@if (isFieldInvalid('name')) {
					<ion-text color="danger">
						<small>{{ getFieldErrorMessage('name') }}</small>
					</ion-text>
					}
					<ion-item>
						<ion-input
							type="text"
							label="Apellido"
							labelPlacement="floating"
							formControlName="last_name"
							[disabled]="isValidatingIdentification"
							[class.ion-invalid]="isFieldInvalid('last_name')"
							[class.ion-valid]="isFieldAsyncValid('last_name')"
							[class.ion-touched]="
								memberForm.get('last_name')?.touched
							"
						></ion-input>
						@if (getFieldValidationIcon('last_name')) {
						<ion-icon
							slot="end"
							[name]="getFieldValidationIcon('last_name')"
							[color]="getFieldValidationColor('last_name')"
						></ion-icon>
						}
					</ion-item>
					@if (isFieldInvalid('last_name')) {
					<ion-text color="danger">
						<small>{{ getFieldErrorMessage('last_name') }}</small>
					</ion-text>
					}
					<ion-item [lines]="'none'">
						<ion-input
							type="text"
							label="Teléfono"
							labelPlacement="floating"
							formControlName="phone_number"
							[counter]="true"
							[maxlength]="10"
							[disabled]="isValidatingIdentification"
							[class.ion-invalid]="isFieldInvalid('phone_number')"
							[class.ion-valid]="
								isFieldAsyncValid('phone_number')
							"
							[class.ion-touched]="
								memberForm.get('phone_number')?.touched
							"
							(ionInput)="onNumericInput($event, 'phone_number')"
						></ion-input>
						@if (getFieldValidationIcon('phone_number')) {
						<ion-icon
							slot="end"
							[name]="getFieldValidationIcon('phone_number')"
							[color]="getFieldValidationColor('phone_number')"
						></ion-icon>
						}
					</ion-item>
					@if (isFieldInvalid('phone_number')) {
					<ion-text color="danger">
						<small>{{
							getFieldErrorMessage('phone_number')
						}}</small>
					</ion-text>
					}
				</ion-list>
				<ion-button
					expand="block"
					color="secondary"
					style="width: 80%; margin: 1em auto"
					(click)="onConfirm()"
					[disabled]="
						!memberForm.valid ||
						identificationExists ||
						isValidatingIdentification
					"
					>{{
						identificationExists
							? 'Cédula ya registrada'
							: 'Confirmar Afiliación'
					}}</ion-button
				>
			</form>
		</ion-content>
	`,
	styleUrl: './member-formulary.component.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [MemberService],
})
export class MemberFormularyComponent implements OnInit {
	memberForm!: FormGroup;
	identificationExists = false;
	isValidatingIdentification = false;

	// Validation states for real-time feedback
	fieldValidationStates: {
		[key: string]: { isValidating: boolean; isValid: boolean };
	} = {
		identification: { isValidating: false, isValid: false },
		name: { isValidating: false, isValid: false },
		last_name: { isValidating: false, isValid: false },
		phone_number: { isValidating: false, isValid: false },
	};

	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private readonly memberService: MemberService
	) {}

	ngOnInit(): void {
		this.memberForm = new FormGroup({
			identification: new FormControl('', [
				Validators.required,
				Validators.pattern(/^\d{11}$/),
			]),
			name: new FormControl('', [
				Validators.required,
				Validators.minLength(2),
			]),
			last_name: new FormControl('', [
				Validators.required,
				Validators.minLength(2),
			]),
			phone_number: new FormControl('', [
				Validators.required,
				Validators.pattern(/^\d{10}$/),
			]),
		});

		// Listen to identification changes and validate if member exists
		this.memberForm
			.get('identification')
			?.valueChanges.pipe(
				debounceTime(500), // Wait 500ms after user stops typing
				distinctUntilChanged() // Only proceed if value actually changed
			)
			.subscribe((identification: string) => {
				// Reset states
				this.identificationExists = false;
				this.isValidatingIdentification = false;

				// Only validate if identification has at least 11 characters and is valid
				if (
					identification &&
					identification.length >= 11 &&
					/^\d{11}$/.test(identification)
				) {
					this.isValidatingIdentification = true;
					this.memberService
						.findIfMemberAlreadyExists(identification)
						.subscribe({
							next: (exists: boolean) => {
								this.identificationExists = exists;
								this.isValidatingIdentification = false;
							},
							error: () => {
								this.isValidatingIdentification = false;
							},
						});
				}
			});
	}

	/**
	 * Check if a form field is invalid and has been touched
	 */
	isFieldInvalid(fieldName: string): boolean {
		const field = this.memberForm.get(fieldName);
		return !!(field?.invalid && field?.touched);
	}

	/**
	 * Check if a field is currently being validated
	 */
	isFieldValidating(fieldName: string): boolean {
		return this.fieldValidationStates[fieldName]?.isValidating || false;
	}

	/**
	 * Check if a field is valid after async validation
	 */
	isFieldAsyncValid(fieldName: string): boolean {
		const field = this.memberForm.get(fieldName);
		const isFormValid = field?.valid || false;
		const isAsyncValid =
			this.fieldValidationStates[fieldName]?.isValid || false;
		return isFormValid && isAsyncValid && (field?.touched || false);
	}

	/**
	 * Get the validation icon for a field
	 */
	getFieldValidationIcon(fieldName: string): string {
		if (this.isFieldValidating(fieldName)) return 'time-outline';

		// Special handling for identification field
		if (fieldName === 'identification') {
			const field = this.memberForm.get('identification');
			const hasValidFormat = field?.valid && field?.value?.length === 11;

			if (this.identificationExists) return 'close-circle';
			if (hasValidFormat && !this.identificationExists && field?.touched)
				return 'checkmark-circle';
			if (this.isFieldInvalid(fieldName)) return 'alert-circle';
		}

		if (this.isFieldAsyncValid(fieldName)) return 'checkmark-circle';
		if (this.isFieldInvalid(fieldName)) return 'alert-circle';
		return '';
	}

	/**
	 * Get the validation color for a field
	 */
	getFieldValidationColor(fieldName: string): string {
		if (this.isFieldValidating(fieldName)) return 'medium';

		// Special handling for identification field
		if (fieldName === 'identification') {
			const field = this.memberForm.get('identification');
			const hasValidFormat = field?.valid && field?.value?.length === 11;

			if (this.identificationExists) return 'danger';
			if (hasValidFormat && !this.identificationExists && field?.touched)
				return 'success';
			if (this.isFieldInvalid(fieldName)) return 'danger';
		}

		if (this.isFieldAsyncValid(fieldName)) return 'success';
		if (this.isFieldInvalid(fieldName)) return 'danger';
		return '';
	}

	/**
	 * Get custom error message for a form field
	 */
	getFieldErrorMessage(fieldName: string): string {
		const field = this.memberForm.get(fieldName);
		if (!field?.errors || !field?.touched) return '';

		const errors = field.errors;

		switch (fieldName) {
			case 'identification':
				if (errors['required'])
					return 'La identificación es obligatoria';
				if (errors['pattern'])
					return 'La identificación debe tener exactamente 11 dígitos numéricos';
				break;
			case 'name':
				if (errors['required']) return 'El nombre es obligatorio';
				if (errors['minlength'])
					return 'El nombre debe tener al menos 2 caracteres';
				break;
			case 'last_name':
				if (errors['required']) return 'El apellido es obligatorio';
				if (errors['minlength'])
					return 'El apellido debe tener al menos 2 caracteres';
				break;
			case 'phone_number':
				if (errors['required']) return 'El teléfono es obligatorio';
				if (errors['pattern'])
					return 'El teléfono debe tener exactamente 10 dígitos numéricos';
				break;
		}

		return 'Campo inválido';
	}

	/**
	 * Get custom error message for identification existence
	 */
	getIdentificationExistsMessage(): string {
		return '⚠️ Esta cédula ya está registrada en nuestro sistema. Por favor, verifique el número ingresado o contacte al administrador si considera que esto es un error.';
	}

	/**
	 * Check if identification validation is complete and valid
	 */
	isIdentificationValid(): boolean {
		const field = this.memberForm.get('identification');
		return !!(
			field?.valid &&
			field?.touched &&
			!this.identificationExists &&
			!this.isValidatingIdentification
		);
	}

	/**
	 * Handle numeric input validation - only allow numbers
	 */
	onNumericInput(event: any, fieldName: string): void {
		const input = event.target;
		let value = input.value;

		// Remove any non-digit characters
		const numericValue = value.replace(/[^0-9]/g, '');

		// Update the form control with the cleaned value
		this.memberForm
			.get(fieldName)
			?.setValue(numericValue, { emitEvent: false });

		// Update the input display
		input.value = numericValue;

		// Trigger async validation for the field
		if (fieldName === 'identification') {
			this.validateIdentificationAsync(numericValue);
		} else if (fieldName === 'phone_number') {
			this.validateFieldAsync(fieldName, numericValue);
		}
	}

	/**
	 * Validate identification field with server check
	 */
	private validateIdentificationAsync(identification: string): void {
		// Reset states
		this.identificationExists = false;
		this.fieldValidationStates['identification'] = {
			isValidating: false,
			isValid: false,
		};

		// Only validate if identification has at least 11 characters and is valid
		if (
			identification &&
			identification.length >= 11 &&
			/^\d{11}$/.test(identification)
		) {
			this.isValidatingIdentification = true;
			this.fieldValidationStates['identification'].isValidating = true;

			this.memberService
				.findIfMemberAlreadyExists(identification)
				.subscribe({
					next: (exists: boolean) => {
						this.identificationExists = exists;
						this.isValidatingIdentification = false;
						this.fieldValidationStates['identification'] = {
							isValidating: false,
							isValid: !exists,
						};

						// Force form field to be marked as touched for proper validation display
						const field = this.memberForm.get('identification');
						if (field && !field.touched) {
							field.markAsTouched();
						}
					},
					error: () => {
						this.isValidatingIdentification = false;
						this.fieldValidationStates[
							'identification'
						].isValidating = false;
					},
				});
		} else {
			// Update validation state for invalid format
			const field = this.memberForm.get('identification');
			this.fieldValidationStates['identification'].isValid =
				field?.valid || false;
			this.isValidatingIdentification = false;
		}
	}

	/**
	 * Generic async validation for other fields
	 */
	private validateFieldAsync(fieldName: string, value: string): void {
		// Set validation state to validating
		this.fieldValidationStates[fieldName].isValidating = true;

		// Simulate async validation with setTimeout
		setTimeout(() => {
			const field = this.memberForm.get(fieldName);
			const isValid = field?.valid || false;

			this.fieldValidationStates[fieldName] = {
				isValidating: false,
				isValid: isValid && value.length > 0,
			};
		}, 200); // Short delay to simulate async validation
	}

	onConfirm() {
		// Prevent submission if identification already exists or form is invalid
		if (
			this.memberForm.valid &&
			!this.identificationExists &&
			!this.isValidatingIdentification
		) {
			const groupId = parseInt(
				this.activatedRoute.snapshot.paramMap.get('id')!
			);

			if (!(groupId && groupId > 0)) throw new Error('Invalid group ID');

			const memberData: ICreateMemberGroupDto = {
				...this.memberForm.value,
				group_id: groupId,
			};

			this.memberService.addMemberToGroup(memberData).subscribe(() => {
				// Navigate back to the detail page after successful creation
				this.router.navigate(['home', groupId], {
					relativeTo: this.activatedRoute,
				});
			});
		}
	}

	onCancel() {}
}
