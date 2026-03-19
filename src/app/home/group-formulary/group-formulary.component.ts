import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import {
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, IonicModule, ModalController } from '@ionic/angular';
import { GroupService } from 'src/app/core/services/group.service';
import { CityEnum } from 'src/app/core/enums/city.enum';

@Component({
	selector: 'app-group-formulary.component',
	imports: [IonicModule, ReactiveFormsModule],
	template: `
		<ion-header class="ion-no-border">
		  <ion-toolbar class="header-toolbar">
		    <ion-buttons slot="start">
		      <ion-button fill="clear" (click)="goBack()">
		        <ion-icon name="arrow-back"></ion-icon>
		      </ion-button>
		    </ion-buttons>
		    <ion-title class="header-title">Crear Nuevo Grupo</ion-title>
		  </ion-toolbar>
		</ion-header>
		
		<ion-content class="form-content">
		  <div class="form-container">
		    <div class="welcome-section">
		      <ion-icon
		        name="people-circle-outline"
		        class="welcome-icon"
		      ></ion-icon>
		      <h2 class="welcome-title">Crear Grupo de Votantes</h2>
		      <p class="welcome-subtitle">
		        Organiza y gestiona tu grupo de votantes de manera
		        eficiente
		      </p>
		    </div>
		
		    <form
		      [formGroup]="groupForm"
		      (ngSubmit)="submitForm()"
		      class="enhanced-form"
		      >
		      <div class="form-fields">
		        <div class="field-container">
		          <ion-item class="custom-item" lines="none">
		            <ion-icon
		              name="people-outline"
		              slot="start"
		              class="field-icon"
		            ></ion-icon>
		            <ion-label
		              position="stacked"
		              class="field-label"
		              >Nombre del Grupo</ion-label
		              >
		              <ion-input
		                formControlName="name"
		                placeholder="Ingresa el nombre del grupo"
		                class="custom-input"
									[class.error]="
										groupForm.get('name')?.invalid &&
										groupForm.get('name')?.touched
									"
		                >
		              </ion-input>
		            </ion-item>
		            @if (
		              groupForm.get('name')?.invalid &&
		              groupForm.get('name')?.touched
		              ) {
		              <div
		                class="error-message"
		                >
		                <ion-icon
		                  name="alert-circle-outline"
		                ></ion-icon>
		                <span>El nombre del grupo es requerido</span>
		              </div>
		            }
		          </div>
		
		          <div class="field-container">
		            <ion-item class="custom-item" lines="none">
		              <ion-icon
		                name="location-outline"
		                slot="start"
		                class="field-icon"
		              ></ion-icon>
		              <ion-label
		                position="stacked"
		                class="field-label"
		                >Ciudad</ion-label
		                >
		                <ion-select
		                  formControlName="city"
		                  placeholder="Selecciona la ciudad"
		                  class="custom-input"
									[class.error]="
										groupForm.get('city')?.invalid &&
										groupForm.get('city')?.touched
									"
		                  >
		                  @for (city of cities; track city) {
		                    <ion-select-option [value]="city">{{
		                      city.formattedName
		                    }}</ion-select-option>
		                  }
		                </ion-select>
		              </ion-item>
		              @if (
		                groupForm.get('city')?.invalid &&
		                groupForm.get('city')?.touched
		                ) {
		                <div
		                  class="error-message"
		                  >
		                  <ion-icon
		                    name="alert-circle-outline"
		                  ></ion-icon>
		                  <span>La ciudad es requerida</span>
		                </div>
		              }
		            </div>
		          </div>
		
		          <div class="button-container">
		            <ion-button
		              type="submit"
		              [disabled]="groupForm.invalid"
		              expand="block"
		              class="create-button"
		              size="large"
		              >
		              <ion-icon
		                name="checkmark-circle-outline"
		                slot="start"
		              ></ion-icon>
		              Crear Grupo
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
	styleUrls: ['./group-formulary.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [GroupService],
})
export class GroupFormularyComponent implements OnInit {
	groupForm!: FormGroup;

	cities!: { name: string; formattedName: string }[];

	constructor(
		private groupService: GroupService,
		private _alertCtrl: AlertController,
		private _modalCtrl: ModalController,
		private $router: Router,
	) {}

	ngOnInit(): void {
		this.cities = Object.values(CityEnum).map((city) => ({
			name: city,
			formattedName: city.replace(/_/g, ' '),
		}));

		this.groupForm = new FormGroup({
			name: new FormControl('', [Validators.required]),
			city: new FormControl('', [Validators.required]),
		});
	}

	async goBack(): Promise<void> {
		await this._modalCtrl.dismiss();
	}

	submitForm(): void {
		if (this.groupForm.valid) {
			const groupData = this.groupForm.value;
			console.log('Form Data:', groupData);
			this.groupService
				.createGroup({
					name: groupData.name,
					city: groupData.city?.name,
				})
				.subscribe(async () => {
					const alert = await this._alertCtrl.create({
						header: 'Exito',
						message: '¡Grupo creado con éxito!',
						buttons: ['OK'],
					});

					await alert.present();
					await alert.onDidDismiss();

					this.groupForm.reset();
					this._modalCtrl.dismiss();
				});
		}
	}
}
