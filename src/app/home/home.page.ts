import { AfterViewInit, Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { UserService } from '../core/services/user.service';
import { IDecodedToken } from '../core/models/idecoded-token';
import { GroupService } from '../core/services/group.service';
import { IGroupListItemModel } from '../core/models/igroup-list-item.model';
import { CommonModule } from '@angular/common';

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

	async ngOnInit() {
		this.userData$.set(await this.userService.getUserData());
	}

	ngAfterViewInit(): void {
		this.groupService.getAllGroups({}).subscribe((groups) => {
			this.groups$.set(groups);
		});
	}

	openGroupDetails() {
		this.$router.navigate(['home', 1]);
	}
}
