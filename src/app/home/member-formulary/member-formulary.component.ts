import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
	Form,
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { ICreateMemberGroupDto } from 'src/app/core/dto/member/icreate-member-group.dto';
import { MemberService } from 'src/app/core/services/member.service';

@Component({
	selector: 'app-member-formulary',
	imports: [IonicModule, ReactiveFormsModule],
	template: `
		<ion-header>
			<ion-toolbar color="secondary">
				<ion-buttons slot="start">
					<ion-back-button></ion-back-button>
				</ion-buttons>
				<ion-title>Formulario Afiliación</ion-title>
			</ion-toolbar>
		</ion-header>
		<ion-content class="ion-padding">
			<form [formGroup]="memberForm">
				<ion-list style="width: 80%; margin: auto; margin-top: 30%;">
					<ion-list-header>
						<div class="column">
							<ion-label>
								<h1>Datos del Miembro</h1>
							</ion-label>
							<ion-label>
								<p>
									Por favor, complete el siguiente formulario
									para agregar un nuevo miembro.
								</p>
							</ion-label>
						</div>
					</ion-list-header>
					<ion-item [lines]="'none'">
						<ion-input
							type="text"
							label="Identificación"
							labelPlacement="floating"
							formControlName="identification"
							[counter]="true"
							[maxlength]="11"
						></ion-input>
					</ion-item>
					<ion-item>
						<ion-input
							type="text"
							label="Nombre"
							labelPlacement="floating"
							formControlName="name"
							[disabled]="isValidatingIdentification"
						></ion-input>
					</ion-item>
					<ion-item>
						<ion-input
							type="text"
							label="Apellido"
							labelPlacement="floating"
							formControlName="last_name"
							[disabled]="isValidatingIdentification"
						></ion-input>
					</ion-item>
					<ion-item [lines]="'none'">
						<ion-input
							type="text"
							label="Teléfono"
							labelPlacement="floating"
							formControlName="phone_number"
							[counter]="true"
							[maxlength]="10"
							[disabled]="isValidatingIdentification"
						></ion-input>
					</ion-item>
				</ion-list>
				<ion-button
					expand="block"
					color="secondary"
					style="width: 80%; margin: 1em auto"
					(click)="onConfirm()"
					[disabled]="
						!memberForm.valid ||
						identificationExists ||
						isValidatingIdentification
					"
					>Confirmar Afiliación</ion-button
				>
			</form>
		</ion-content>
	`,
	styleUrl: './member-formulary.component.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [MemberService],
})
export class MemberFormularyComponent implements OnInit {
	memberForm!: FormGroup;
	identificationExists = false;
	isValidatingIdentification = false;
	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private readonly memberService: MemberService
	) {}

	ngOnInit(): void {
		this.memberForm = new FormGroup({
			identification: new FormControl('', [
				Validators.required,
				Validators.pattern(/^\d{11}$/),
			]),
			name: new FormControl('', [Validators.required]),
			last_name: new FormControl('', [Validators.required]),
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
				distinctUntilChanged() // Only proceed if value actually changed
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

	onConfirm() {
		// Prevent submission if identification already exists or form is invalid
		if (
			this.memberForm.valid &&
			!this.identificationExists &&
			!this.isValidatingIdentification
		) {
			const groupId = parseInt(
				this.activatedRoute.snapshot.paramMap.get('id')!
			);

			if (!(groupId && groupId > 0)) throw new Error('Invalid group ID');

			const memberData: ICreateMemberGroupDto = {
				...this.memberForm.value,
				group_id: groupId,
			};

			this.memberService.addMemberToGroup(memberData).subscribe(() => {
				// Navigate back to the detail page after successful creation
				this.router.navigate(['home', groupId], {
					relativeTo: this.activatedRoute,
				});
			});
		}
	}

	onCancel() {}
}
