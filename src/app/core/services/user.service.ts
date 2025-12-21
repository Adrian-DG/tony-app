import { computed, Injectable, signal } from '@angular/core';
import { GenericService } from './generic.service';
import { IRegisterUserDTO } from '../dto/user/iregister-user.dto';
import { ILoginUserDTO } from '../dto/user/ilogin-user.dto';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { IDecodedToken } from '../models/idecoded-token';
import { StorageService } from './storage.service';

@Injectable({
	providedIn: 'root',
})
export class UserService extends GenericService {
	getResourceUrl(): string {
		return 'users';
	}

	constructor(
		protected override $http: HttpClient,
		private $router: Router,
		private readonly _storage: StorageService,
		private readonly jwtHelper: JwtHelperService
	) {
		super($http);
	}

	isAuthenticated$ = computed(() => {
		const token = this._storage.getItem('access_token');
		return token && !this.jwtHelper.isTokenExpired(token);
	});

	getUserData() {
		const token = this._storage.getItem('access_token');
		if (!token) return null;
		const decodedToken = this.jwtHelper.decodeToken(
			token
		) as unknown as IDecodedToken;
		return decodedToken;
	}

	registerUser(payload: IRegisterUserDTO) {
		return this.$http.post(`${this.apiUrl}/register`, payload);
	}

	loginUser(payload: ILoginUserDTO) {
		this.$http
			.post(`${this.apiUrl}/login`, payload)
			.subscribe((response) => {
				const { access_token } = response as { access_token: string };
				this._storage.setItem('access_token', access_token);
				this.$router.navigate(['/home']);
			});
	}

	redirectToLogin() {
		this._storage.removeItem('access_token');
		this.$router.navigate(['login']);
	}
}
