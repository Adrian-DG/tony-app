import { HttpClient } from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class GenericService {
	constructor(protected $http: HttpClient) {}
}
