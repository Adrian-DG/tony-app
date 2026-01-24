import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { GroupService } from 'src/app/core/services/group.service';

@Component({
	selector: 'app-group-formulary.component',
	imports: [ReactiveFormsModule],
	template: `<p>group-formulary.component works!</p>`,
	styleUrl: './group-formulary.component.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [GroupService],
})
export class GroupFormularyComponent implements OnInit {
	groupForm!: FormGroup;

	constructor(
		private groupService: GroupService,
		private _alertCtrl: AlertController,
		private $router: Router,
	) {}

	ngOnInit(): void {
		this.groupForm = new FormGroup({
			name: new FormControl('', [Validators.required]),
			city: new FormControl('', [Validators.required]),
		});
	}

	submitForm(): void {
		if (this.groupForm.valid) {
			const groupData = this.groupForm.value;
			this.groupService
				.createGroup(groupData)
				.subscribe(async (response) => {
					const alert = await this._alertCtrl.create({
						header: 'Exito',
						message: '¡Grupo creado con éxito!',
						buttons: ['OK'],
					});

					await alert.present();

					await alert.onDidDismiss().then(() => {
						this.groupForm.reset();
						this.$router.navigate(['home']);
					});
				});
		}
	}
}
