import * as React from 'react';

export default function Header(props) {
	if (props.type === 'h1') {
		return <h1>{ props.title }</h1>;
	} else {
		return <h2>{props.title}</h2>;
	}
};
