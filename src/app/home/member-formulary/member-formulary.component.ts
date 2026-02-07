import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, IonicModule, ModalController } from '@ionic/angular';

import { IonInputCustomEvent, InputInputEventDetail } from '@ionic/core';
import { debounceTime, distinctUntilChanged, switchMap, map } from 'rxjs';
import { ICreateMemberGroupDto } from 'src/app/core/dto/member/icreate-member-group.dto';
import { MemberService } from 'src/app/core/services/member.service';

@Component({
	selector: 'app-member-formulary',
	imports: [IonicModule, ReactiveFormsModule],
	template: `
		<ion-header class="ion-no-border">
		  <ion-toolbar class="header-toolbar">
		    <ion-buttons slot="start">
		      <ion-button fill="clear" (click)="goBack()">
		        <ion-icon name="arrow-back"></ion-icon>
		      </ion-button>
		    </ion-buttons>
		    <ion-title class="header-title"
		      >Afiliar Nuevo Miembro</ion-title
		      >
		    </ion-toolbar>
		  </ion-header>
		
		  <ion-content class="form-content">
		    <div class="form-container">
		      <div class="welcome-section">
		        <ion-icon
		          name="person-add-outline"
		          class="welcome-icon"
		        ></ion-icon>
		        <h2 class="welcome-title">Afiliar Miembro</h2>
		        <p class="welcome-subtitle">
		          Agrega un nuevo miembro al grupo de manera eficiente
		        </p>
		      </div>
		
		      <form [formGroup]="memberForm" class="enhanced-form">
		        <div class="form-fields">
		          <div class="field-container">
		            <ion-item class="custom-item" lines="none">
		              <ion-icon
		                name="card-outline"
		                slot="start"
		                class="field-icon"
		              ></ion-icon>
		              <ion-label
		                position="stacked"
		                class="field-label"
		                >Identificación</ion-label
		                >
		                <ion-input
		                  formControlName="identification"
		                  placeholder="Ingresa el número de identificación"
		                  class="custom-input"
		                  type="text"
		                  maxlength="11"
									[class.error]="
										isFieldInvalid('identification') ||
										identificationExists
									"
		                  [class.success]="isIdentificationValid()"
									(ionInput)="
										onNumericInput($event, 'identification')
									"
		                  >
		                </ion-input>
		                @if (
		                  getFieldValidationIcon(
		                  'identification'
		                  ) ||
		                  isValidatingIdentification ||
		                  identificationExists
		                  ) {
		                  <ion-icon
		                    slot="end"
		                    class="validation-icon"
									[name]="
										isValidatingIdentification
											? 'time-outline'
											: identificationExists
												? 'alert-circle'
												: getFieldValidationIcon(
														'identification'
													)
									"
									[color]="
										isValidatingIdentification
											? 'medium'
											: identificationExists
												? 'danger'
												: getFieldValidationColor(
														'identification'
													)
									"
		                  ></ion-icon>
		                }
		              </ion-item>
		              @if (
		                isFieldInvalid('identification') &&
		                !identificationExists
		                ) {
		                <div
		                  class="error-message"
		                  >
		                  <ion-icon
		                    name="alert-circle-outline"
		                  ></ion-icon>
		                  <span>{{
		                    getFieldErrorMessage('identification')
		                  }}</span>
		                </div>
		              }
		              @if (
		                identificationExists &&
		                !isValidatingIdentification
		                ) {
		                <div
		                  class="error-message"
		                  >
		                  <ion-icon
		                    name="close-circle-outline"
		                  ></ion-icon>
		                  <span>{{
		                    getIdentificationExistsMessage()
		                  }}</span>
		                </div>
		              }
		              @if (isIdentificationValid()) {
		                <div
		                  class="success-message"
		                  >
		                  <ion-icon
		                    name="checkmark-circle-outline"
		                  ></ion-icon>
		                  <span>Cédula disponible para registro</span>
		                </div>
		              }
		              @if (isValidatingIdentification) {
		                <div
		                  class="validating-message"
		                  >
		                  <ion-icon name="time-outline"></ion-icon>
		                  <span>Verificando cédula...</span>
		                </div>
		              }
		            </div>
		
		            <div class="field-container">
		              <ion-item class="custom-item" lines="none">
		                <ion-icon
		                  name="person-outline"
		                  slot="start"
		                  class="field-icon"
		                ></ion-icon>
		                <ion-label
		                  position="stacked"
		                  class="field-label"
		                  >Nombre</ion-label
		                  >
		                  <ion-input
		                    formControlName="name"
		                    placeholder="Ingresa el nombre"
		                    class="custom-input"
		                    type="text"
		                    [disabled]="isValidatingIdentification"
		                    [class.error]="isFieldInvalid('name')"
		                    [class.success]="isFieldAsyncValid('name')"
		                    >
		                  </ion-input>
		                  @if (getFieldValidationIcon('name')) {
		                    <ion-icon
		                      slot="end"
		                      class="validation-icon"
		                      [name]="getFieldValidationIcon('name')"
		                      [color]="getFieldValidationColor('name')"
		                    ></ion-icon>
		                  }
		                </ion-item>
		                @if (isFieldInvalid('name')) {
		                  <div
		                    class="error-message"
		                    >
		                    <ion-icon
		                      name="alert-circle-outline"
		                    ></ion-icon>
		                    <span>{{ getFieldErrorMessage('name') }}</span>
		                  </div>
		                }
		              </div>
		
		              <div class="field-container">
		                <ion-item class="custom-item" lines="none">
		                  <ion-icon
		                    name="person-outline"
		                    slot="start"
		                    class="field-icon"
		                  ></ion-icon>
		                  <ion-label
		                    position="stacked"
		                    class="field-label"
		                    >Apellido</ion-label
		                    >
		                    <ion-input
		                      formControlName="last_name"
		                      placeholder="Ingresa el apellido"
		                      class="custom-input"
		                      type="text"
		                      [disabled]="isValidatingIdentification"
		                      [class.error]="isFieldInvalid('last_name')"
									[class.success]="
										isFieldAsyncValid('last_name')
									"
		                      >
		                    </ion-input>
		                    @if (getFieldValidationIcon('last_name')) {
		                      <ion-icon
		                        slot="end"
		                        class="validation-icon"
		                        [name]="getFieldValidationIcon('last_name')"
									[color]="
										getFieldValidationColor('last_name')
									"
		                      ></ion-icon>
		                    }
		                  </ion-item>
		                  @if (isFieldInvalid('last_name')) {
		                    <div
		                      class="error-message"
		                      >
		                      <ion-icon
		                        name="alert-circle-outline"
		                      ></ion-icon>
		                      <span>{{
		                        getFieldErrorMessage('last_name')
		                      }}</span>
		                    </div>
		                  }
		                </div>
		
		                <div class="field-container">
		                  <ion-item class="custom-item" lines="none">
		                    <ion-icon
		                      name="call-outline"
		                      slot="start"
		                      class="field-icon"
		                    ></ion-icon>
		                    <ion-label
		                      position="stacked"
		                      class="field-label"
		                      >Teléfono</ion-label
		                      >
		                      <ion-input
		                        formControlName="phone_number"
		                        placeholder="Ingresa el número de teléfono"
		                        class="custom-input"
		                        type="tel"
		                        maxlength="10"
		                        [disabled]="isValidatingIdentification"
									[class.error]="
										isFieldInvalid('phone_number')
									"
									[class.success]="
										isFieldAsyncValid('phone_number')
									"
									(ionInput)="
										onNumericInput($event, 'phone_number')
									"
		                        >
		                      </ion-input>
		                      @if (
		                        getFieldValidationIcon('phone_number')
		                        ) {
		                        <ion-icon
		                          slot="end"
		                          class="validation-icon"
									[name]="
										getFieldValidationIcon('phone_number')
									"
									[color]="
										getFieldValidationColor('phone_number')
									"
		                        ></ion-icon>
		                      }
		                    </ion-item>
		                    @if (isFieldInvalid('phone_number')) {
		                      <div
		                        class="error-message"
		                        >
		                        <ion-icon
		                          name="alert-circle-outline"
		                        ></ion-icon>
		                        <span>{{
		                          getFieldErrorMessage('phone_number')
		                        }}</span>
		                      </div>
		                    }
		                  </div>
		                </div>
		
		                <div class="button-container">
		                  <ion-button
							[disabled]="
								!memberForm.valid ||
								identificationExists ||
								isValidatingIdentification
							"
		                    expand="block"
		                    class="create-button"
		                    size="large"
		                    (click)="onConfirm()"
		                    >
		                    <ion-icon
		                      name="checkmark-circle-outline"
		                      slot="start"
		                    ></ion-icon>
		                    Confirmar Afiliación
		                  </ion-button>
		
		                  <ion-button
		                    fill="clear"
		                    expand="block"
		                    class="cancel-button"
		                    size="large"
		                    (click)="goBack()"
		                    >
		                    Cancelar
		                  </ion-button>
		                </div>
		              </form>
		            </div>
		          </ion-content>
		`,
	styleUrls: ['./member-formulary.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [MemberService],
})
export class MemberFormularyComponent implements OnInit {
	memberForm!: FormGroup;
	identificationExists = false;
	isValidatingIdentification = false;
	groupId!: number;

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
		private memberService: MemberService,
		private _alertCtrl: AlertController,
		private _modalCtrl: ModalController,
	) {
		this.groupId = parseInt(
			this.activatedRoute.snapshot.paramMap.get('id')!,
		);
	}

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
				distinctUntilChanged(), // Only proceed if value actually changed
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
		if (this.memberForm.valid) {
			if (!(this.groupId && this.groupId > 0))
				throw new Error('Invalid group ID');

			const memberData: ICreateMemberGroupDto = {
				...this.memberForm.value,
				group_id: this.groupId,
			};

			console.log('Submitting member data:', memberData);

			this.memberService
				.addMemberToGroup(memberData)
				.subscribe(async () => {
					// Navigate back to the detail page after successful creation
					const alert = await this._alertCtrl.create({
						header: 'Miembro Afiliado',
						message:
							'El miembro ha sido afiliado exitosamente al grupo.',
						buttons: ['OK'],
					});

					await alert.present();
					await alert.onDidDismiss();
					this.router.navigate(['home', this.groupId]);
				});
		}
	}

	private navigateToDetail() {
		this.router.navigate(['home', this.groupId]);
	}

	goBack() {
		this.router.navigate(['home', this.groupId]);
	}

	onCancel() {
		this._alertCtrl
			.create({
				header: 'Cancelar Afiliación',
				message:
					'¿Está seguro de que desea cancelar? Los datos ingresados se perderán.',
				buttons: [
					{
						text: 'No',
						role: 'cancel',
					},
					{
						text: 'Sí, Cancelar',
						handler: () => this.navigateToDetail(),
					},
				],
			})
			.then((alert) => alert.present());
	}
}
