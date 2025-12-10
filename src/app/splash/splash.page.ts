import { Component, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
	selector: 'app-splash',
	imports: [IonicModule, RouterModule],
	templateUrl: './splash.page.html',
	styleUrls: ['./splash.page.scss'],
})
export class SplashPage implements OnInit {
	isActionVisible$ = signal<boolean>(false);
	constructor() {}
	ngOnInit(): void {
		setTimeout(() => {
			this.isActionVisible$.set(true);
		}, 3000);
	}
}
