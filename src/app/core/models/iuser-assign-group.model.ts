export interface IUserAssignGroupModel {
	id: number;
	name: string;
	last_name: string;
	assigned_groups: { id: string; name: string }[];
}
