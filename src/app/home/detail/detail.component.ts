import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-detail',
	templateUrl: './detail.component.html',
	styleUrls: ['./detail.component.scss'],
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
