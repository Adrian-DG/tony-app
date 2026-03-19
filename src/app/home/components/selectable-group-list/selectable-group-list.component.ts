import {
	ChangeDetectionStrategy,
	Component,
	Input,
	OnInit,
	signal,
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { AlertController, IonicModule, ModalController } from '@ionic/angular';
import { IGroupListItemModel } from 'src/app/core/models/igroup-list-item.model';
import { GroupService } from 'src/app/core/services/group.service';

@Component({
	selector: 'app-selectable-group-list',
	imports: [IonicModule, FormsModule],
	template: `
		<ion-header class="ion-no-border">
			<ion-toolbar class="header-toolbar">
				<ion-buttons slot="start">
					<ion-button fill="clear" (click)="closeModal()">
						<ion-icon name="close"></ion-icon>
					</ion-button>
				</ion-buttons>
				<ion-title class="header-title">Seleccionar Grupos</ion-title>
				<ion-buttons slot="end">
					<ion-button
						fill="clear"
						(click)="getGroups()"
						class="refresh-button"
					>
						<ion-icon name="refresh-outline"></ion-icon>
					</ion-button>
				</ion-buttons>
			</ion-toolbar>
		</ion-header>

		<ion-content class="list-content">
			<div class="content-container">
				<div class="welcome-section">
					<ion-icon
						name="checkbox-outline"
						class="welcome-icon"
					></ion-icon>
					<h2 class="welcome-title">Asignar a Grupos</h2>
					<p class="welcome-subtitle">
						Selecciona los grupos a los que deseas asignar este
						usuario
					</p>
				</div>

				@if (groups$().length > 0) {
					<div class="groups-section">
						<div class="section-header">
							<ion-icon
								name="people-outline"
								class="section-icon"
							></ion-icon>
							<h3 class="section-title">Grupos Disponibles</h3>
							<ion-badge class="groups-count" color="secondary">
								{{ groups$().length }}
							</ion-badge>
						</div>

						<div class="groups-list">
							@for (group of groups$(); track group.id) {
								<div
									class="group-item"
									[class.selected]="isGroupSelected(group.id)"
								>
									<div class="group-info">
										<ion-icon
											name="people-circle-outline"
											class="group-icon"
										></ion-icon>
										<div class="group-details">
											<h4 class="group-name">
												{{ group.name }}
											</h4>
											<p class="group-city">
												<ion-icon
													name="location-outline"
													class="location-icon"
												></ion-icon>
												{{ group.city }}
											</p>
										</div>
									</div>
									<ion-checkbox
										class="group-checkbox"
										[checked]="isGroupSelected(group.id)"
										(ionChange)="
											toggleGroupSelection(
												group.id,
												$event
											)
										"
									></ion-checkbox>
								</div>
							}
						</div>
					</div>

					<div class="action-buttons">
						<ion-button
							expand="block"
							class="save-button"
							size="large"
							(click)="saveChanges()"
							[disabled]="!hasChanges()"
						>
							<ion-icon
								name="checkmark-circle-outline"
								slot="start"
							></ion-icon>
							Guardar Cambios
						</ion-button>

						<ion-button
							fill="clear"
							expand="block"
							class="cancel-button"
							size="large"
							(click)="closeModal()"
						>
							Cancelar
						</ion-button>
					</div>
				} @else {
					<div class="empty-state">
						<ion-icon
							name="people-outline"
							class="empty-icon"
						></ion-icon>
						<h3 class="empty-title">No hay grupos disponibles</h3>
						<p class="empty-subtitle">
							No se encontraron grupos en el sistema
						</p>
						<ion-button
							fill="outline"
							class="retry-button"
							(click)="getGroups()"
						>
							<ion-icon
								name="refresh-outline"
								slot="start"
							></ion-icon>
							Intentar de nuevo
						</ion-button>
					</div>
				}
			</div>
		</ion-content>
	`,
	styleUrls: ['./selectable-group-list.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [GroupService],
})
export class SelectableGroupListComponent implements OnInit {
	groups$ = signal<IGroupListItemModel[]>([]);
	selectedGroupIds = signal<number[]>([]);
	@Input() userGroupIds: number[] = [];

	constructor(
		private groupService: GroupService,
		private _modalCtrl: ModalController,
		private _alertCtrl: AlertController,
	) {}

	ngOnInit(): void {
		this.selectedGroupIds.set([...this.userGroupIds]);
		this.getGroups();
	}

	getGroups(): void {
		this.groupService.getAllGroups({}).subscribe({
			next: (groups) => {
				this.groups$.set(groups);
			},
			error: async (error) => {
				console.error('Error fetching groups:', error);
				const alert = await this._alertCtrl.create({
					header: 'Error',
					message:
						'No se pudieron cargar los grupos. Intenta de nuevo.',
					buttons: ['OK'],
				});
				await alert.present();
			},
		});
	}

	isGroupSelected(groupId: number): boolean {
		return this.selectedGroupIds().includes(groupId);
	}

	toggleGroupSelection(groupId: number, event: any): void {
		const isChecked = event.detail.checked;
		const currentSelection = [...this.selectedGroupIds()];

		if (isChecked) {
			if (!currentSelection.includes(groupId)) {
				currentSelection.push(groupId);
			}
		} else {
			const index = currentSelection.indexOf(groupId);
			if (index > -1) {
				currentSelection.splice(index, 1);
			}
		}

		this.selectedGroupIds.set(currentSelection);
	}

	hasChanges(): boolean {
		const current = [...this.selectedGroupIds()].sort();
		const original = [...this.userGroupIds].sort();
		return JSON.stringify(current) !== JSON.stringify(original);
	}

	async saveChanges(): Promise<void> {
		if (!this.hasChanges()) {
			await this.closeModal();
			return;
		}

		const alert = await this._alertCtrl.create({
			header: 'Confirmar cambios',
			message: '¿Estás seguro de que deseas guardar estos cambios?',
			buttons: [
				{
					text: 'Cancelar',
					role: 'cancel',
				},
				{
					text: 'Guardar',
					handler: () => {
						// TODO: Implement save logic
						console.log(
							'Selected groups:',
							this.selectedGroupIds(),
						);
						this.closeModal();
					},
				},
			],
		});

		await alert.present();
	}

	async closeModal(): Promise<void> {
		await this._modalCtrl.dismiss({
			selectedGroupIds: this.selectedGroupIds(),
			hasChanges: this.hasChanges(),
		});
	}
}
