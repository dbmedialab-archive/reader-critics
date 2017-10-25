export interface UserProps {
	key?: any;
	createdAt?: Date;
	updatedAt?: Date;
	ID: string | number;
	password?: string;
	email: string;
	name: string;
	role?: string;
	state?:any;
}
