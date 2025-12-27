import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { IBaseStatModel } from '../models/ibase-stat.model';

@Injectable({
	providedIn: 'root',
})
export class StatsService extends GenericService {
	override getResourceUrl(): string {
		return 'stats';
	}

	constructor(protected override $http: HttpClient) {
		super($http);
	}

	getGroupsByCity() {
		return this.$http.get<IBaseStatModel[]>(
			`${this.apiUrl}/groups-by-city`
		);
	}

	getMembersByGroup() {
		return this.$http.get<IBaseStatModel[]>(
			`${this.apiUrl}/members-by-group`
		);
	}

	getMembersByCity() {
		return this.$http.get<IBaseStatModel[]>(
			`${this.apiUrl}/members-by-city`
		);
	}
}
