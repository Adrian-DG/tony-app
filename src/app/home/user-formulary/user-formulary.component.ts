import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, IonicModule, ModalController } from '@ionic/angular';
import { UserService } from 'src/app/core/services/user.service';

@Component({
	selector: 'app-user-formulary.component',
	imports: [IonicModule, ReactiveFormsModule, CommonModule],
	template: `
		<ion-header class="ion-no-border">
			<ion-toolbar class="header-toolbar">
				<ion-buttons slot="start">
					<ion-button fill="clear" (click)="goBack()">
						<ion-icon name="arrow-back"></ion-icon>
					</ion-button>
				</ion-buttons>
				<ion-title class="header-title">Crear Nuevo Usuario</ion-title>
			</ion-toolbar>
		</ion-header>

		<ion-content class="form-content">
			<div class="form-container">
				<div class="welcome-section">
					<ion-icon
						name="person-add-outline"
						class="welcome-icon"
					></ion-icon>
					<h2 class="welcome-title">Crear Usuario</h2>
					<p class="welcome-subtitle">
						Añade un nuevo usuario al sistema de manera eficiente
					</p>
				</div>

				<form
					[formGroup]="userForm"
					(ngSubmit)="submitForm()"
					class="enhanced-form"
				>
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
									[class.error]="
										userForm.get('identification')
											?.invalid &&
										userForm.get('identification')?.touched
									"
								>
								</ion-input>
							</ion-item>
							<div
								class="error-message"
								*ngIf="
									userForm.get('identification')?.invalid &&
									userForm.get('identification')?.touched
								"
							>
								<ion-icon
									name="alert-circle-outline"
								></ion-icon>
								<span>La identificación es requerida</span>
							</div>
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
									[class.error]="
										userForm.get('name')?.invalid &&
										userForm.get('name')?.touched
									"
								>
								</ion-input>
							</ion-item>
							<div
								class="error-message"
								*ngIf="
									userForm.get('name')?.invalid &&
									userForm.get('name')?.touched
								"
							>
								<ion-icon
									name="alert-circle-outline"
								></ion-icon>
								<span>El nombre es requerido</span>
							</div>
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
									[class.error]="
										userForm.get('last_name')?.invalid &&
										userForm.get('last_name')?.touched
									"
								>
								</ion-input>
							</ion-item>
							<div
								class="error-message"
								*ngIf="
									userForm.get('last_name')?.invalid &&
									userForm.get('last_name')?.touched
								"
							>
								<ion-icon
									name="alert-circle-outline"
								></ion-icon>
								<span>El apellido es requerido</span>
							</div>
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
									[class.error]="
										userForm.get('phone_number')?.invalid &&
										userForm.get('phone_number')?.touched
									"
								>
								</ion-input>
							</ion-item>
							<div
								class="error-message"
								*ngIf="
									userForm.get('phone_number')?.invalid &&
									userForm.get('phone_number')?.touched
								"
							>
								<ion-icon
									name="alert-circle-outline"
								></ion-icon>
								<span>El número de teléfono es requerido</span>
							</div>
						</div>

						<div class="field-container">
							<ion-item class="custom-item" lines="none">
								<ion-icon
									name="shield-outline"
									slot="start"
									class="field-icon"
								></ion-icon>
								<ion-label
									position="stacked"
									class="field-label"
									>Rol</ion-label
								>
								<ion-select
									formControlName="role"
									placeholder="Selecciona el rol"
									class="custom-input"
									[class.error]="
										userForm.get('role')?.invalid &&
										userForm.get('role')?.touched
									"
								>
									@for (role of roles; track role.value) {
										<ion-select-option
											[value]="role.value"
											>{{ role.label }}</ion-select-option
										>
									}
								</ion-select>
							</ion-item>
							<div
								class="error-message"
								*ngIf="
									userForm.get('role')?.invalid &&
									userForm.get('role')?.touched
								"
							>
								<ion-icon
									name="alert-circle-outline"
								></ion-icon>
								<span>El rol es requerido</span>
							</div>
						</div>
					</div>

					<div class="button-container">
						<ion-button
							type="submit"
							[disabled]="userForm.invalid"
							expand="block"
							class="create-button"
							size="large"
						>
							<ion-icon
								name="checkmark-circle-outline"
								slot="start"
							></ion-icon>
							Crear Usuario
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
	styleUrls: ['./user-formulary.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [UserService],
})
export class UserFormularyComponent implements OnInit {
	userForm!: FormGroup;

	roles = [
		{ value: 'ADMIN', label: 'Administrador' },
		{ value: 'SUPERVISOR', label: 'Supervisor' },
		{ value: 'MEMBER', label: 'Miembro' },
	];

	constructor(
		private userService: UserService,
		private _alertCtrl: AlertController,
		private _modalCtrl: ModalController,
	) {}

	ngOnInit(): void {
		this.userForm = new FormGroup({
			identification: new FormControl('', [
				Validators.required,
				Validators.minLength(6),
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
				Validators.pattern(/^[0-9]{10}$/),
			]),
			role: new FormControl('', [Validators.required]),
		});
	}

	async goBack(): Promise<void> {
		await this._modalCtrl.dismiss();
	}

	submitForm(): void {
		if (this.userForm.valid) {
			const userData = this.userForm.value;
			console.log('User Form Data:', userData);
			this.userService
				.registerUser(userData)
				.subscribe(async (response) => {
					const alert = await this._alertCtrl.create({
						header: 'Éxito',
						message: '¡Usuario creado con éxito!',
						buttons: ['OK'],
					});

					await alert.present();
					await alert.onDidDismiss();

					this.userForm.reset();
					this._modalCtrl.dismiss();
				});
		}
	}
}
