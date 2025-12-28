import { HttpClient } from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';
import { environment as DEV } from 'src/environments/environment';
import { environment as PROD } from 'src/environments/environment.prod';

@Injectable({
	providedIn: 'root',
})
export abstract class GenericService {
	protected readonly apiUrl!: string;
	constructor(protected $http: HttpClient) {
		this.apiUrl = `${
			isDevMode() ? DEV.api_url : PROD.api_url
		}/${this.getResourceUrl()}`;
	}

	abstract getResourceUrl(): string;
}
