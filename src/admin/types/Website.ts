import User from 'base/User';

export interface WebsiteProps {
	key?: any;
	ID: string | number;
	name: string;
	chiefEditors: User[],
	parser: string;
	hosts: string[];
	state?: any;
}
