import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';

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

	// @Get('groups-by-city')
	// @ApiOperation({ summary: 'Get groups count grouped by city' })
	// @UseGuards(AuthGuard)
	// @ApiBearerAuth()
	// async getGroupsByCity(@Req() request) {
	//   const userId = request['userId'];
	//   const userRole = request['role'];
	//   const result = await this.statsService.getGroupsByCity(userId, userRole);
	//   return result;
	// }

	// @Get('members-by-group')
	// @ApiOperation({ summary: 'Get members count grouped by group' })
	// async getMembersByGroup(@Req() request) {
	//   const userId = request['userId'];
	//   const userRole = request['role'];
	//   const result = await this.statsService.getMembersByGroup(userId, userRole);
	//   return result;
	// }

	getGroupsByCity() {
		return;
	}
}
