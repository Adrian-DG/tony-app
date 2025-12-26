import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IMemberListItemModel } from '../models/imember-list-item.model';
import { ICreateMemberGroupDto } from '../dto/member/icreate-member-group.dto';

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

	addMemberToGroup(member: ICreateMemberGroupDto) {
		return this.$http.post(`${this.apiUrl}/add-to-group`, member);
	}

	getAllMembersByGroupId(groupId: number) {
		const params = new HttpParams().set('groupId', groupId.toString());
		return this.$http.get<IMemberListItemModel[]>(`${this.apiUrl}`, {
			params,
		});
	}
}
