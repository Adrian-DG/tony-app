import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IGroupListItemModel } from '../models/igroup-list-item.model';
import { IFilterDto } from '../dto/ifilter.dto';
import { ICreateGroupDto } from '../dto/group/icreate-group.dto';
import { ICreateUserGroupDto } from '../dto/group/icreate-user-group.dto';

@Injectable({
	providedIn: 'root',
})
export class GroupService extends GenericService {
	override getResourceUrl(): string {
		return 'groups';
	}

	constructor(protected override $http: HttpClient) {
		super($http);
	}

	getAllGroups(filter: IFilterDto) {
		const params = new HttpParams().set('search', filter.search || '');
		return this.$http.get<IGroupListItemModel[]>(`${this.apiUrl}`, {
			params,
		});
	}

	createGroup(groupData: ICreateGroupDto) {
		return this.$http.post(`${this.apiUrl}`, groupData);
	}

	addUserToGroups(model: ICreateUserGroupDto) {
		console.log('Adding user to groups with model:', model);
		return this.$http.post(`${this.apiUrl}/assign-user`, model);
	}
}
