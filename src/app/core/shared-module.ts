import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenericService } from './services/generic.service';
import { UserService } from './services/user.service';

@NgModule({
	declarations: [],
	imports: [CommonModule],
	providers: [UserService],
})
export class SharedModule {}
