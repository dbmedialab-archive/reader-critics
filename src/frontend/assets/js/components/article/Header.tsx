import * as React from 'react';

export interface HeaderProps { title: string; }

export default class Header extends React.Component<HeaderProps, undefined> {
	private title: string;

	constructor(props: HeaderProps) {
		super(props);
		this.title = props.title;
	}

	render() {
		return (
			<h2>{this.title}</h2>
		);
	}
}
