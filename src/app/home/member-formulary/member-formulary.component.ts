import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
	selector: 'app-member-formulary',
	imports: [IonicModule],
	template: `
		<ion-header>
			<ion-toolbar color="secondary">
				<ion-title>Formulario Afiliación</ion-title>
			</ion-toolbar>
		</ion-header>
		<ion-content class="ion-padding">
			<ion-list style="width: 80%; margin: auto; margin-top: 30%;">
				<ion-list-header>
					<div class="column">
						<ion-label>
							<h1>Datos del Miembro</h1>
						</ion-label>
						<ion-label>
							<p>
								Por favor, complete el siguiente formulario para
								agregar un nuevo miembro.
							</p>
						</ion-label>
					</div>
				</ion-list-header>
				<ion-item>
					<ion-label position="floating">Cédula</ion-label>
					<ion-input type="text"></ion-input>
				</ion-item>
				<ion-item>
					<ion-label position="floating">Nombre</ion-label>
					<ion-input type="text"></ion-input>
				</ion-item>
				<ion-item>
					<ion-label position="floating">Apellido</ion-label>
					<ion-input type="text"></ion-input>
				</ion-item>
			</ion-list>
			<ion-button
				expand="block"
				color="secondary"
				style="width: 80%; margin: 1em auto"
				>Confirmar Afiliación</ion-button
			>
		</ion-content>
	`,
	styleUrl: './member-formulary.component.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MemberFormularyComponent {
	constructor(private _modalCtrl: ModalController) {}

	onConfirm() {
		this._modalCtrl.dismiss();
	}

	onCancel() {
		this._modalCtrl.dismiss();
	}
}
