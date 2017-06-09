import * as React from 'react';

export interface TitleProps { title: string; }

export default function Title (props) {
	return (
		<h1>{props.title}</h1>
	);
};
