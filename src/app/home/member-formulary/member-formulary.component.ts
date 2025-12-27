import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
	Form,
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IonicModule, ModalController } from '@ionic/angular';
import { ICreateMemberGroupDto } from 'src/app/core/dto/member/icreate-member-group.dto';
import { MemberService } from 'src/app/core/services/member.service';

@Component({
	selector: 'app-member-formulary',
	imports: [IonicModule, ReactiveFormsModule],
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
					<ion-input
						type="text"
						formControlName="identification"
					></ion-input>
				</ion-item>
				<ion-item>
					<ion-label position="floating">Nombre</ion-label>
					<ion-input type="text" formControlName="name"></ion-input>
				</ion-item>
				<ion-item>
					<ion-label position="floating">Apellido</ion-label>
					<ion-input
						type="text"
						formControlName="last_name"
					></ion-input>
				</ion-item>
				<ion-item>
					<ion-label position="floating">Teléfono</ion-label>
					<ion-input
						type="text"
						formControlName="phone_number"
					></ion-input>
				</ion-item>
			</ion-list>
			<ion-button
				expand="block"
				color="secondary"
				style="width: 80%; margin: 1em auto"
				(click)="onConfirm()"
				>Confirmar Afiliación</ion-button
			>
		</ion-content>
	`,
	styleUrl: './member-formulary.component.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [MemberService],
})
export class MemberFormularyComponent implements OnInit {
	memberForm!: FormGroup;
	constructor(
		private activatedRoute: ActivatedRoute,
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
	}

	onConfirm() {
		if (this.memberForm.valid) {
			const groupId = parseInt(
				this.activatedRoute.snapshot.paramMap.get('id')!
			);

			if (!(groupId && groupId > 0)) throw new Error('Invalid group ID');

			const memberData: ICreateMemberGroupDto = {
				...this.memberForm.value,
				groupId: groupId,
			};

			this.memberService.addMemberToGroup(memberData).subscribe(() => {});
		}
	}

	onCancel() {}
}
