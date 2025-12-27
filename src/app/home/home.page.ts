import { AfterViewInit, Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { UserService } from '../core/services/user.service';
import { IDecodedToken } from '../core/models/idecoded-token';
import { GroupService } from '../core/services/group.service';
import { IGroupListItemModel } from '../core/models/igroup-list-item.model';
import { CommonModule } from '@angular/common';
import { UserRole } from '../core/enums/user-role.enum';

@Component({
	selector: 'app-home',
	imports: [IonicModule, CommonModule],
	templateUrl: './home.page.html',
	styleUrls: ['./home.page.scss'],
	providers: [UserService, GroupService],
})
export class HomePage implements OnInit, AfterViewInit {
	userData$ = signal<IDecodedToken | null>(null);
	groups$ = signal<IGroupListItemModel[]>([]);
	constructor(
		private $router: Router,
		private userService: UserService,
		private groupService: GroupService
	) {}

	get userCanViewStats(): boolean {
		const userRole = this.userData$()?.role || '';
		return [UserRole.ADMIN, UserRole.SUPERVISOR].includes(
			userRole as UserRole
		);
	}

	async ngOnInit() {
		this.userData$.set(await this.userService.getUserData());
	}

	ngAfterViewInit(): void {
		this.groupService.getAllGroups({}).subscribe((groups) => {
			this.groups$.set(groups);
		});
	}

	onViewGroupDetail(item: IGroupListItemModel) {
		this.$router.navigate(['home', item.id]);
	}

	onViewStatistics() {
		this.$router.navigate(['home', 'stats']);
	}
}
