import { computed, Injectable, signal } from '@angular/core';
import { GenericService } from './generic.service';
import { IRegisterUserDTO } from '../dto/user/iregister-user.dto';
import { ILoginUserDTO } from '../dto/user/ilogin-user.dto';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage-angular';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
	providedIn: 'root',
})
export class UserService extends GenericService {
	getResourceUrl(): string {
		return 'users';
	}

	private token$ = signal<string | null>(null);
	isAuthenticated$ = computed(() => {
		const token = this.token$();
		return token != null && !this.jwtHelper.isTokenExpired(token);
	});

	constructor(
		protected override $http: HttpClient,
		private $router: Router,
		private readonly storage: Storage,
		private readonly jwtHelper: JwtHelperService
	) {
		super($http);
		this.initStorage();
	}

	private async initStorage() {
		await this.storage.create();
		const token = await this.storage.get('access_token');
		this.token$.set(token);

		// If user is authenticated, redirect to home
		if (token && !this.jwtHelper.isTokenExpired(token)) {
			this.$router.navigate(['/home']);
		}
	}

	private async saveToken(token: string) {
		await this.storage.set('access_token', token);
		this.token$.set(token);
	}

	registerUser(payload: IRegisterUserDTO) {
		return this.$http.post(`${this.apiUrl}/register`, payload);
	}

	loginUser(payload: ILoginUserDTO) {
		this.$http
			.post(`${this.apiUrl}/login`, payload)
			.subscribe((response) => {
				const { access_token } = response as { access_token: string };
				this.saveToken(access_token);
				this.$router.navigate(['/home']);
			});
	}

	redirectToLogin() {
		this.storage.remove('access_token');
		this.token$.set(null);
		this.$router.navigate(['login']);
	}
}
