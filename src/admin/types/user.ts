export interface UserProps {
	key: any;
	id: number;
	password: string;
	tokens?: AuthToken[];
	email: string;
	profile: {
		name: string;
		field?: string;
		picture?: string;
	};
}

export type AuthToken = {
	accessToken: string,
	kind: string,
};
