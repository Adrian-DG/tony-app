import {
	ChangeDetectionStrategy,
	Component,
	OnInit,
	signal,
	computed,
} from '@angular/core';
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
				<!-- Groups by City Pie Chart with Deferrable View -->
				@defer (on viewport) {
				<div class="chart-section">
					<h2>Grupos por Ciudad</h2>
					<div class="chart-wrapper">
						@if (isGroupsByCityLoaded()) {
						<canvas
							baseChart
							[data]="groupsByCityChartData()"
							[type]="pieChartType"
							[options]="pieChartOptions"
						></canvas>
						} @else if (isGroupsByCityLoading()) {
						<div class="loading-container">
							<ion-spinner
								name="circular"
								color="primary"
							></ion-spinner>
							<p>Cargando datos de grupos por ciudad...</p>
						</div>
						} @else {
						<ion-card>
							<ion-card-content>
								<ion-text color="danger">
									<p>
										Error al cargar datos de grupos por
										ciudad
									</p>
								</ion-text>
							</ion-card-content>
						</ion-card>
						}
					</div>
				</div>
				} @placeholder {
				<div class="chart-section">
					<h2>Grupos por Ciudad</h2>
					<div class="chart-wrapper">
						<div class="placeholder-content">
							<ion-skeleton-text
								animated
								style="width: 200px; height: 200px; border-radius: 50%;"
							></ion-skeleton-text>
						</div>
					</div>
				</div>
				} @loading (minimum 500ms) {
				<div class="chart-section">
					<h2>Grupos por Ciudad</h2>
					<div class="chart-wrapper">
						<div class="loading-container">
							<ion-spinner
								name="circular"
								color="primary"
							></ion-spinner>
							<p>Inicializando gráfico...</p>
						</div>
					</div>
				</div>
				}

				<!-- Members by Group Bar Chart with Deferrable View -->
				@defer (on viewport) {
				<div class="chart-section">
					<h2>Miembros por Grupo</h2>
					<div class="chart-wrapper">
						@if (isMembersByGroupLoaded()) {
						<canvas
							baseChart
							[data]="membersByGroupChartData()"
							[type]="barChartType"
							[options]="barChartOptions"
						></canvas>
						} @else if (isMembersByGroupLoading()) {
						<div class="loading-container">
							<ion-spinner
								name="circular"
								color="primary"
							></ion-spinner>
							<p>Cargando datos de miembros por grupo...</p>
						</div>
						} @else {
						<ion-card>
							<ion-card-content>
								<ion-text color="danger">
									<p>
										Error al cargar datos de miembros por
										grupo
									</p>
								</ion-text>
							</ion-card-content>
						</ion-card>
						}
					</div>
				</div>
				} @placeholder {
				<div class="chart-section">
					<h2>Miembros por Grupo</h2>
					<div class="chart-wrapper">
						<div class="placeholder-content">
							<ion-skeleton-text
								animated
								style="width: 100%; height: 200px;"
							></ion-skeleton-text>
						</div>
					</div>
				</div>
				} @loading (minimum 500ms) {
				<div class="chart-section">
					<h2>Miembros por Grupo</h2>
					<div class="chart-wrapper">
						<div class="loading-container">
							<ion-spinner
								name="circular"
								color="primary"
							></ion-spinner>
							<p>Inicializando gráfico...</p>
						</div>
					</div>
				</div>
				}
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

	// Raw data signals
	groupsByCityRawData = signal<IBaseStatModel[]>([]);
	membersByGroupRawData = signal<IBaseStatModel[]>([]);

	// Loading state signals
	isGroupsByCityLoading = signal<boolean>(false);
	isMembersByGroupLoading = signal<boolean>(false);

	// Error state signals
	groupsByCityError = signal<string | null>(null);
	membersByGroupError = signal<string | null>(null);

	// Computed signals for loaded states
	isGroupsByCityLoaded = computed(
		() =>
			this.groupsByCityRawData().length > 0 &&
			!this.isGroupsByCityLoading() &&
			!this.groupsByCityError()
	);

	isMembersByGroupLoaded = computed(
		() =>
			this.membersByGroupRawData().length > 0 &&
			!this.isMembersByGroupLoading() &&
			!this.membersByGroupError()
	);

	// Computed chart data signals
	groupsByCityChartData = computed<ChartData<'pie'>>(() => {
		const data = this.groupsByCityRawData();
		if (data.length === 0) {
			return { labels: [], datasets: [] };
		}

		return {
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
						'#FF8C00',
						'#C9CBCF',
					],
					borderColor: [
						'#FF6384',
						'#36A2EB',
						'#FFCE56',
						'#4BC0C0',
						'#9966FF',
						'#FF9F40',
						'#FF8C00',
						'#C9CBCF',
					],
					borderWidth: 2,
					hoverOffset: 4,
				},
			],
		};
	});

	membersByGroupChartData = computed<ChartData<'bar'>>(() => {
		const data = this.membersByGroupRawData();
		if (data.length === 0) {
			return { labels: [], datasets: [] };
		}

		return {
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
	});

	// Chart Options
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
	 * Load Groups by City data for pie chart using signals
	 */
	private loadGroupsByCityChart(): void {
		this.isGroupsByCityLoading.set(true);
		this.groupsByCityError.set(null);

		this.statsService.getGroupsByCity().subscribe({
			next: (data: IBaseStatModel[]) => {
				this.groupsByCityRawData.set(data);
				this.isGroupsByCityLoading.set(false);
			},
			error: (error) => {
				console.error('Error loading groups by city data:', error);
				this.groupsByCityError.set(
					'Error al cargar datos de grupos por ciudad'
				);
				this.isGroupsByCityLoading.set(false);
			},
		});
	}

	/**
	 * Load Members by Group data for bar chart using signals
	 */
	private loadMembersByGroupChart(): void {
		this.isMembersByGroupLoading.set(true);
		this.membersByGroupError.set(null);

		this.statsService.getMembersByGroup().subscribe({
			next: (data: IBaseStatModel[]) => {
				this.membersByGroupRawData.set(data);
				this.isMembersByGroupLoading.set(false);
			},
			error: (error) => {
				console.error('Error loading members by group data:', error);
				this.membersByGroupError.set(
					'Error al cargar datos de miembros por grupo'
				);
				this.isMembersByGroupLoading.set(false);
			},
		});
	}

	/**
	 * Refresh all chart data
	 */
	refreshData(): void {
		this.loadChartsData();
	}
}
