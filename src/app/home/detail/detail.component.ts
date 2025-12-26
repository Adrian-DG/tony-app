import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonicModule, ModalController } from '@ionic/angular';
import { IMemberListItemModel } from 'src/app/core/models/imember-list-item.model';
import { MemberService } from 'src/app/core/services/member.service';
import { MemberFormularyComponent } from '../member-formulary/member-formulary.component';

@Component({
	selector: 'app-detail',
	templateUrl: './detail.component.html',
	styleUrls: ['./detail.component.scss'],
	imports: [IonicModule],
	providers: [MemberService],
})
export class DetailComponent implements OnInit {
	groupId!: number;
	members$ = signal<IMemberListItemModel[]>([]);

	constructor(
		private activatedRoute: ActivatedRoute,
		private memberService: MemberService,
		private _modalCtrl: ModalController
	) {}

	ngOnInit() {
		this.groupId = parseInt(
			this.activatedRoute.snapshot.paramMap.get('id')!
		);
		if (!isNaN(this.groupId)) {
			this.getMembers();
		}
	}

	getMembers() {
		this.memberService
			.getAllMembersByGroupId(this.groupId)
			.subscribe((members) => {
				this.members$.set(members);
			});
	}

	async openFormularyModal() {
		const modal = await this._modalCtrl.create({
			component: MemberFormularyComponent,
		});
		await modal.present();
	}
}
