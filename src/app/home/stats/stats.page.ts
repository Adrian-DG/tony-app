import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
	selector: 'app-stats',
	imports: [IonicModule],
	template: `
		<ion-header>
			<ion-toolbar color="secondary">
				<ion-buttons slot="start">
					<ion-back-button defaultHref="/home"></ion-back-button>
				</ion-buttons>
				<ion-title>Estadísticas</ion-title>
			</ion-toolbar>
		</ion-header>

		<ion-content class="ion-padding">
			<h2>Página de Estadísticas</h2>
			<p>Aquí se mostrarán las estadísticas relevantes.</p>
		</ion-content>
	`,
	styleUrl: './stats.page.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatsPage {}
