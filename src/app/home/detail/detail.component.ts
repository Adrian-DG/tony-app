import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
	selector: 'app-detail',
	templateUrl: './detail.component.html',
	styleUrls: ['./detail.component.scss'],
	imports: [IonicModule],
})
export class DetailComponent implements OnInit {
	groupId!: number;

	constructor(private activatedRoute: ActivatedRoute) {}

	ngOnInit() {
		this.groupId = parseInt(
			this.activatedRoute.snapshot.paramMap.get('id')!
		);
	}
}
