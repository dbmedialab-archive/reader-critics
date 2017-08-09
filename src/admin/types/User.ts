export interface UserProps {
	key: any;
	createdAt?: Date;
	updatedAt?: Date;
	id: string | number;
	password?: string;
	tokens?: AuthToken[];
	email: string;
	profile: {
		name: string;
		field?: string;
		picture?: string;
		bio?: string;
		role?: string;
	};
}

export type AuthToken = {
	accessToken: string,
	kind: string,
};
