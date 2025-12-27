import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { BaseChartDirective } from 'ng2-charts';
import { StatsService } from 'src/app/core/services/stats.service';

@Component({
	selector: 'app-stats',
	imports: [IonicModule, BaseChartDirective],
	template: `
		<ion-header>
			<ion-toolbar color="secondary">
				<ion-buttons slot="start">
					<ion-back-button defaultHref="/home"></ion-back-button>
				</ion-buttons>
				<ion-title>Estadísticas</ion-title>
			</ion-toolbar>
		</ion-header>

		<ion-content class="ion-padding"> </ion-content>
	`,
	styleUrl: './stats.page.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [StatsService],
})
export class StatsPage implements OnInit {
	constructor(private statsService: StatsService) {}

	ngOnInit() {}
}
