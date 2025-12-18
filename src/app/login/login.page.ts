import { Component, OnInit } from '@angular/core';
import {
	FormBuilder,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {
	MaskitoOptions,
	MaskitoElementPredicate,
	maskitoTransform,
} from '@maskito/core';
import { MaskitoDirective } from '@maskito/angular';
import { UserService } from '../core/services/user.service';
import { ILoginUserDTO } from '../core/dto/user/ilogin-user.dto';
import { Router } from '@angular/router';

@Component({
	selector: 'app-login',
	imports: [IonicModule, ReactiveFormsModule, MaskitoDirective],
	templateUrl: './login.page.html',
	styleUrls: ['./login.page.scss'],
	providers: [UserService],
})
export class LoginPage implements OnInit {
	loginForm: FormGroup;

	readonly identificationMask: MaskitoOptions = {
		mask: [
			/\d/,
			/\d/,
			/\d/,
			'-',
			/\d/,
			/\d/,
			/\d/,
			/\d/,
			/\d/,
			/\d/,
			/\d/,
			'-',
			/\d/,
		],
	};

	identificationMaskedValue = maskitoTransform(
		'00000000000',
		this.identificationMask
	);

	// En login.page.ts
	readonly identificationPredicate: MaskitoElementPredicate = async (
		element
	) => {
		// Use querySelector to directly find the native input element.
		// This is a common and necessary pattern for Maskito with Ionic's Web Components.
		return element.querySelector('input')!;
	};

	constructor(
		private fb: FormBuilder,
		private userService: UserService,
		private router: Router
	) {
		this.loginForm = this.fb.group({
			identification: ['', [Validators.required]],
			phone_number: ['', [Validators.required]],
		});
	}

	ngOnInit() {}

	onLogin() {
		if (this.loginForm.valid) {
			console.log('Login successful', this.loginForm.value);
			const { identification, phone_number } = this.loginForm.value;
			const payload: ILoginUserDTO = {
				identification: identification,
				phone_number: phone_number,
			};
			this.userService.loginUser(payload).subscribe((response) => {
				console.log('User logged in successfully:', response);
				this.router.navigate(['/home']);
			});
		}
	}
}
