import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { IRegisterUserDTO } from '../dto/user/iregister-user.dto';
import { ILoginUserDTO } from '../dto/user/ilogin-user.dto';

@Injectable({
	providedIn: 'root',
})
export class UserService extends GenericService {
	getResourceUrl(): string {
		return 'users';
	}

	registerUser(payload: IRegisterUserDTO) {
		return this.$http.post(`${this.apiUrl}/register`, payload);
	}

	loginUser(payload: ILoginUserDTO) {
		return this.$http.post(`${this.apiUrl}/login`, payload);
	}
}
