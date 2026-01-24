import { computed, Injectable, signal } from '@angular/core';
import { GenericService } from './generic.service';
import { IRegisterUserDTO } from '../dto/user/iregister-user.dto';
import { ILoginUserDTO } from '../dto/user/ilogin-user.dto';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { IDecodedToken } from '../models/idecoded-token';
import { StorageService } from './storage.service';
import { IUserAssignGroupModel } from '../models/iuser-assign-group.model';

@Injectable({
	providedIn: 'root',
})
export class UserService extends GenericService {
	getResourceUrl(): string {
		return 'users';
	}

	isAuthenticated$ = computed(async () => {
		const token = await this._storage.getItem('access_token');
		return token != null && !this.jwtHelper.isTokenExpired(token);
	});

	constructor(
		protected override $http: HttpClient,
		private $router: Router,
		private readonly _storage: StorageService,
		private readonly jwtHelper: JwtHelperService,
	) {
		super($http);
	}

	async getUserData(): Promise<IDecodedToken | null> {
		const token = await this._storage.getItem('access_token');
		if (!token) return null;
		const decodedToken = this.jwtHelper.decodeToken(
			token,
		) as unknown as IDecodedToken;
		console.log('Decoded Token:', decodedToken);
		return decodedToken;
	}

	registerUser(payload: IRegisterUserDTO) {
		return this.$http.post(`${this.apiUrl}/register`, payload);
	}

	async loginUser(payload: ILoginUserDTO) {
		this.$http
			.post(`${this.apiUrl}/login`, payload)
			.subscribe(async (response) => {
				const { access_token } = response as { access_token: string };
				await this._storage.setItem('access_token', access_token);
				this.$router.navigate(['home']);
			});
	}

	async redirectToLogin() {
		await this._storage.removeItem('access_token');
		this.$router.navigate(['login']);
	}

	findUserWithAssignedGroups(param: string) {
		const params = new HttpParams().set('param', param);
		return this.$http.get<IUserAssignGroupModel>(
			`${this.apiUrl}/with-groups`,
			{
				params,
			},
		);
	}
}
