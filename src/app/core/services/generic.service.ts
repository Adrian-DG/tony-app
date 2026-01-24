import { HttpClient } from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';
import { environment as prod } from '../../../environments/environment.prod';
import { environment as dev } from '../../../environments/environment';

@Injectable({
	providedIn: 'root',
})
export abstract class GenericService {
	protected readonly apiUrl!: string;
	constructor(protected $http: HttpClient) {
		this.apiUrl = `${
			isDevMode() ? dev.api_url : prod.api_url
		}/${this.getResourceUrl()}`;
	}

	abstract getResourceUrl(): string;
}
