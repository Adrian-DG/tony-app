import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IMemberListItemModel } from '../models/imember-list-item.model';

@Injectable({
	providedIn: 'root',
})
export class MemberService extends GenericService {
	override getResourceUrl(): string {
		return 'members';
	}

	constructor(protected override $http: HttpClient) {
		super($http);
	}

	getAllMembersByGroupId(groupId: number) {
		const params = new HttpParams().set('groupId', groupId.toString());
		return this.$http.get<IMemberListItemModel[]>(`${this.apiUrl}`, {
			params,
		});
	}
}
