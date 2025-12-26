import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HomePageRoutingModule } from './home-routing.module';
import { SharedModule } from '../core/shared-module';

@NgModule({
	imports: [
		CommonModule,
		SharedModule,
		FormsModule,
		IonicModule,
		HomePageRoutingModule,
	],
	declarations: [],
})
export class HomePageModule {}
