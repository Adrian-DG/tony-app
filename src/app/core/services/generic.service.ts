import { HttpClient } from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export abstract class GenericService {
	protected readonly apiUrl!: string;
	constructor(protected $http: HttpClient) {
		this.apiUrl = `${
			isDevMode() ? 'http://localhost:3000' : 'https://api.example.com'
		}/${this.getResourceUrl()}`;
	}

	abstract getResourceUrl(): string;
}
