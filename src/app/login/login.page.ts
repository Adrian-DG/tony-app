import { Component, OnInit } from '@angular/core';
import {
	FormBuilder,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
	selector: 'app-login',
	imports: [IonicModule, ReactiveFormsModule],
	templateUrl: './login.page.html',
	styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
	loginForm: FormGroup;

	constructor(private fb: FormBuilder) {
		this.loginForm = this.fb.group({
			username: ['', Validators.required],
			password: ['', Validators.required],
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
