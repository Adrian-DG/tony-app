import {
	ChangeDetectionStrategy,
	Component,
	OnInit,
	signal,
} from '@angular/core';

import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, IonicModule, ModalController } from '@ionic/angular';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { IUserAssignGroupModel } from 'src/app/core/models/iuser-assign-group.model';
import { UserService } from 'src/app/core/services/user.service';
import { IGroupListItemModel } from 'src/app/core/models/igroup-list-item.model';
import { GroupService } from 'src/app/core/services/group.service';
import { SelectableGroupListComponent } from '../components/selectable-group-list/selectable-group-list.component';

@Component({
	selector: 'app-user-group-form.component',
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
		      >Asignar Usuario a Grupo</ion-title
		      >
		    </ion-toolbar>
		  </ion-header>
		
		  <ion-content class="form-content">
		    <div class="form-container">
		      <div class="welcome-section">
		        <ion-icon
		          name="link-outline"
		          class="welcome-icon"
		        ></ion-icon>
		        <h2 class="welcome-title">Gestión de Asignaciones</h2>
		        <p class="welcome-subtitle">
		          Busca usuarios y gestiona sus asignaciones a grupos de
		          manera eficiente
		        </p>
		      </div>
		
		      <div class="search-section">
		        <div class="search-container">
		          <div class="field-container">
		            <ion-item class="custom-item" lines="none">
		              <ion-icon
		                name="search-outline"
		                slot="start"
		                class="field-icon"
		              ></ion-icon>
		              <ion-label
		                position="stacked"
		                class="field-label"
		                >Buscar Usuario</ion-label
		                >
		                <ion-input
		                  [formControl]="userFilterControl"
		                  placeholder="Ingresa cédula o teléfono (10-11 dígitos)"
		                  class="custom-input"
		                  type="text"
									[class.error]="
										userFilterControl.invalid &&
										userFilterControl.touched
									"
		                  >
		                </ion-input>
		              </ion-item>
		              @if (
		                userFilterControl.invalid &&
		                userFilterControl.touched
		                ) {
		                <div
		                  class="error-message"
		                  >
		                  <ion-icon
		                    name="alert-circle-outline"
		                  ></ion-icon>
		                  <span
		                    >Ingresa un documento válido (10-11
		                    dígitos)</span
		                    >
		                  </div>
		                }
		              </div>
		
		              <div class="button-container">
		                <ion-button
		                  [disabled]="userFilterControl.invalid"
		                  expand="block"
		                  class="search-button"
		                  size="large"
		                  (click)="searchUser()"
		                  >
		                  <ion-icon
		                    name="search-outline"
		                    slot="start"
		                  ></ion-icon>
		                  Buscar Usuario
		                </ion-button>
		              </div>
		            </div>
		          </div>
		
		          @if (userGroupInfo$()) {
		            <div class="result-section">
		              <div class="user-info-card">
		                <div class="card-header">
		                  <ion-icon
		                    name="person-circle-outline"
		                    class="user-icon"
		                  ></ion-icon>
		                  <div class="user-details">
		                    <h2 class="user-name">
		                      {{ userGroupInfo$()?.name }}
		                      {{ userGroupInfo$()?.last_name }}
		                    </h2>
		                  </div>
		                  <ion-button
		                    expand="block"
		                    size="small"
		                    class="add-group-button"
		                    (click)="addToGroup()"
		                    >
		                    <ion-icon
		                      name="add"
		                      slot="start"
		                    ></ion-icon>
		                    Agregar a Grupo
		                  </ion-button>
		                </div>
		
		                <div class="groups-section">
		                  <div class="groups-header">
		                    <ion-icon
		                      name="people-outline"
		                      class="groups-icon"
		                    ></ion-icon>
		                    <h3 class="groups-title">
		                      Grupos Asignados
		                    </h3>
		                    <ion-badge
		                      class="groups-count"
		                      color="secondary"
		                      >
		                      {{
		                      userGroupInfo$()?.assigned_groups
		                      ?.length || 0
		                      }}
		                    </ion-badge>
		                  </div>
		
		                  @if (
		                    userGroupInfo$()?.assigned_groups?.length
		                    ) {
		                    <div class="groups-list">
		                      @for (
		                        group of userGroupInfo$()
		                        ?.assigned_groups;
		                        track group.id
		                        ) {
		                        <div class="group-item">
		                          <ion-icon
		                            name="people-circle-outline"
		                            class="group-item-icon"
		                          ></ion-icon>
		                          <div class="group-item-details">
		                            <h4 class="group-name">
		                              {{ group.name }}
		                            </h4>
		                            <p class="group-id">
		                              ID: {{ group.id }}
		                            </p>
		                          </div>
		                          <ion-button
		                            fill="clear"
		                            size="small"
		                            class="group-action-button"
		                            >
		                            <ion-icon
		                              name="ellipsis-horizontal-outline"
		                            ></ion-icon>
		                          </ion-button>
		                        </div>
		                      }
		                    </div>
		                  } @else {
		                    <div class="no-groups">
		                      <ion-icon
		                        name="people-outline"
		                        class="no-groups-icon"
		                      ></ion-icon>
		                      <p class="no-groups-text">
		                        Este usuario no está asignado a
		                        ningún grupo
		                      </p>
		                    </div>
		                  }
		                </div>
		              </div>
		            </div>
		          }
		        </div>
		      </ion-content>
		`,
	styleUrls: ['./user-group-form.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [UserService, GroupService],
})
export class UserGroupFormComponent {
	userFilterControl = new FormControl<string | null>(null, [
		Validators.required,
		Validators.pattern('^[0-9]{10,11}$'),
	]);
	userGroupInfo$ = signal<IUserAssignGroupModel | null>(null);
	groups$ = signal<IGroupListItemModel[]>([]);

	constructor(
		private userService: UserService,
		private groupService: GroupService,
		private $router: Router,
		private _alertCtrl: AlertController,
		private _modalCtrl: ModalController,
	) {}

	async goBack(): Promise<void> {
		try {
			await this._modalCtrl.dismiss();
		} catch {
			this.$router.navigate(['home']);
		}
	}

	searchUser(): void {
		if (this.userFilterControl.valid) {
			const searchParam = this.userFilterControl.value!.trim();
			this.userService.findUserWithAssignedGroups(searchParam).subscribe({
				next: (userGroupInfo) => {
					this.userGroupInfo$.set(userGroupInfo);
				},
				error: async (error) => {
					console.error(
						'Error fetching user with assigned groups:',
						error,
					);
					this.userGroupInfo$.set(null);

					const alert = await this._alertCtrl.create({
						header: 'Error',
						message:
							'No se encontró el usuario o ocurrió un error. Verifica el documento ingresado.',
						buttons: ['OK'],
					});
					await alert.present();
				},
			});
		}
	}

	async addToGroup() {
		const modal = await this._modalCtrl.create({
			component: SelectableGroupListComponent,
			componentProps: {
				userId: this.userGroupInfo$()?.id,
				userGroupIds:
					this.userGroupInfo$()?.assigned_groups.map((g) =>
						Number(g.id),
					) || [],
			},
			breakpoints: [0, 0.5, 0.8, 1],
			initialBreakpoint: 1,
		});

		await modal.present();

		const modalData = (await modal.onDidDismiss()).data;

		console.log('Modal Data:', modalData);

		if (modalData && modalData.hasChanges) {
			this.updateUserGroup(modalData.selectedGroupIds);
		}
	}

	updateUserGroup(selectedGroupIds: number[]): void {
		this.groupService
			.addUserToGroups({
				user_id: this.userGroupInfo$()?.id!,
				group_ids: selectedGroupIds,
			})
			.subscribe({
				next: async () => {
					const alert = await this._alertCtrl.create({
						header: 'Éxito',
						message: '¡Asignaciones actualizadas con éxito!',
						buttons: ['OK'],
					});
					await alert.present();
					await alert.onDidDismiss();

					// Refrescar la información del usuario y sus grupos asignados
					this.searchUser();
				},
				error: async (error) => {
					console.error('Error updating user groups:', error);
					const alert = await this._alertCtrl.create({
						header: 'Error',
						message:
							'No se pudieron actualizar las asignaciones. Intenta de nuevo.',
						buttons: ['OK'],
					});
					await alert.present();
				},
			});
	}
}
