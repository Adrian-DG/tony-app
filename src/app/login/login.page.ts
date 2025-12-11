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

@Component({
	selector: 'app-login',
	imports: [IonicModule, ReactiveFormsModule, MaskitoDirective],
	templateUrl: './login.page.html',
	styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
	loginForm: FormGroup;

	readonly cedulaMask: MaskitoOptions = {
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

	cedulaMaskedValue = maskitoTransform('00000000000', this.cedulaMask);

	// En login.page.ts
	readonly cedulaPredicate: MaskitoElementPredicate = async (element) => {
		// Use querySelector to directly find the native input element.
		// This is a common and necessary pattern for Maskito with Ionic's Web Components.
		return element.querySelector('input')!;
	};

	constructor(private fb: FormBuilder) {
		this.loginForm = this.fb.group({
			cedula: ['', [Validators.required]],
			password: ['', [Validators.required]],
		});
	}

	ngOnInit() {}

	onLogin() {
		if (this.loginForm.valid) {
			console.log('Login successful', this.loginForm.value);
		} else {
			console.log('Invalid form');
		}
	}
}
