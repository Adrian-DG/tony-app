import { Component, OnInit } from '@angular/core';
import { UserService } from './core/services/user.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-root',
	templateUrl: 'app.component.html',
	styleUrls: ['app.component.scss'],
	standalone: false,
	providers: [UserService],
})
export class AppComponent implements OnInit {
	constructor(private router: Router, private userService: UserService) {}
	async ngOnInit(): Promise<void> {
		if (await this.userService.isAuthenticated$()) {
			this.router.navigate(['home']);
		}
	}
}
