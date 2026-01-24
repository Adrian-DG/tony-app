import { CityEnum } from '../../enums/city.enum';

export interface ICreateGroupDto {
	name: string;
	city: CityEnum;
}
