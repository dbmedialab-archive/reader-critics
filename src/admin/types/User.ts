export interface UserProps {
	key: any;
	createdAt?: Date;
	updatedAt?: Date;
	id: string | number;
	password?: string;
	email: string;
	name: string;
	role?: string;
}
