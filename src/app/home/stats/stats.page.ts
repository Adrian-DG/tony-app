import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { BaseChartDirective } from 'ng2-charts';
import {
	Chart,
	ArcElement,
	Tooltip,
	Legend,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
} from 'chart.js';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { StatsService } from 'src/app/core/services/stats.service';
import { IBaseStatModel } from 'src/app/core/models/ibase-stat.model';

// Register Chart.js components
Chart.register(
	ArcElement,
	Tooltip,
	Legend,
	CategoryScale,
	LinearScale,
	BarElement,
	Title
);

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

		<ion-content class="ion-padding">
			<div class="charts-container">
				<!-- Groups by City Pie Chart -->
				<div class="chart-section">
					<h2>Grupos por Ciudad</h2>
					<div class="chart-wrapper">
						@if (groupsByCityData.datasets.length > 0) {
						<canvas
							baseChart
							[data]="groupsByCityData"
							[type]="pieChartType"
							[options]="pieChartOptions"
						></canvas>
						} @else {
						<ion-card>
							<ion-card-content>
								<ion-text color="medium">
									<p>
										Cargando datos de grupos por ciudad...
									</p>
								</ion-text>
							</ion-card-content>
						</ion-card>
						}
					</div>
				</div>

				<!-- Members by Group Bar Chart -->
				<div class="chart-section">
					<h2>Miembros por Grupo</h2>
					<div class="chart-wrapper">
						@if (membersByGroupData.datasets.length > 0) {
						<canvas
							baseChart
							[data]="membersByGroupData"
							[type]="barChartType"
							[options]="barChartOptions"
						></canvas>
						} @else {
						<ion-card>
							<ion-card-content>
								<ion-text color="medium">
									<p>
										Cargando datos de miembros por grupo...
									</p>
								</ion-text>
							</ion-card-content>
						</ion-card>
						}
					</div>
				</div>
			</div>
		</ion-content>
	`,
	styleUrl: './stats.page.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [StatsService],
})
export class StatsPage implements OnInit {
	// Chart Types
	pieChartType = 'pie' as const;
	barChartType = 'bar' as const;

	// Pie Chart Data (Groups by City)
	groupsByCityData: ChartData<'pie'> = {
		labels: [],
		datasets: [],
	};

	// Bar Chart Data (Members by Group)
	membersByGroupData: ChartData<'bar'> = {
		labels: [],
		datasets: [],
	};

	// Pie Chart Options
	pieChartOptions: ChartConfiguration<'pie'>['options'] = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				position: 'bottom',
				labels: {
					padding: 20,
					usePointStyle: true,
				},
			},
			tooltip: {
				callbacks: {
					label: (context) => {
						const value = context.parsed;
						const total = (context.dataset.data as number[]).reduce(
							(a, b) => a + b,
							0
						);
						const percentage = ((value / total) * 100).toFixed(1);
						return `${context.label}: ${value} (${percentage}%)`;
					},
				},
			},
		},
	};

	// Bar Chart Options
	barChartOptions: ChartConfiguration<'bar'>['options'] = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				display: false,
			},
			tooltip: {
				callbacks: {
					label: (context) => {
						return `Miembros: ${context.parsed.y}`;
					},
				},
			},
		},
		scales: {
			x: {
				title: {
					display: true,
					text: 'Grupos',
				},
			},
			y: {
				title: {
					display: true,
					text: 'Número de Miembros',
				},
				beginAtZero: true,
				ticks: {
					stepSize: 1,
				},
			},
		},
	};

	constructor(private statsService: StatsService) {}

	ngOnInit() {
		this.loadChartsData();
	}

	/**
	 * Load data for both charts
	 */
	private loadChartsData(): void {
		this.loadGroupsByCityChart();
		this.loadMembersByGroupChart();
	}

	/**
	 * Load Groups by City data for pie chart
	 */
	private loadGroupsByCityChart(): void {
		this.statsService.getGroupsByCity().subscribe({
			next: (data: IBaseStatModel[]) => {
				this.groupsByCityData = {
					labels: data.map((item) => item.name),
					datasets: [
						{
							data: data.map((item) => item.total),
							backgroundColor: [
								'#FF6384',
								'#36A2EB',
								'#FFCE56',
								'#4BC0C0',
								'#9966FF',
								'#FF9F40',
								'#FF6384',
								'#C9CBCF',
							],
							borderColor: [
								'#FF6384',
								'#36A2EB',
								'#FFCE56',
								'#4BC0C0',
								'#9966FF',
								'#FF9F40',
								'#FF6384',
								'#C9CBCF',
							],
							borderWidth: 2,
							hoverOffset: 4,
						},
					],
				};
			},
			error: (error) => {
				console.error('Error loading groups by city data:', error);
			},
		});
	}

	/**
	 * Load Members by Group data for bar chart
	 */
	private loadMembersByGroupChart(): void {
		this.statsService.getMembersByGroup().subscribe({
			next: (data: IBaseStatModel[]) => {
				this.membersByGroupData = {
					labels: data.map((item) => item.name),
					datasets: [
						{
							label: 'Miembros',
							data: data.map((item) => item.total),
							backgroundColor: 'rgba(54, 162, 235, 0.6)',
							borderColor: 'rgba(54, 162, 235, 1)',
							borderWidth: 2,
							borderRadius: 4,
							borderSkipped: false,
						},
					],
				};
			},
			error: (error) => {
				console.error('Error loading members by group data:', error);
			},
		});
	}
}
