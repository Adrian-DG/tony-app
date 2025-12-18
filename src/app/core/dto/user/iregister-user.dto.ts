export interface IRegisterUserDTO {
	identification: string;
	name: string;
	last_name: string;
	phone_number: string;
	role: 'ADMIN' | 'SUPERVISOR' | 'MEMBER';
}
