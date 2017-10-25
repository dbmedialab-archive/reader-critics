import User from 'base/User';

export interface WebsiteProps {
	key?: any;
	ID: string | number;
	name: string;
	chiefEditors: User[],
	parserClass: string;
	hosts: string[];
	layout: WebsiteLayoutProps;
	state?: any;
}

export interface WebsiteLayoutProps {
	templates? : {
		feedbackPage? : string;
	},
	scssVariables? : Object;
}
