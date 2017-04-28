import * as React from 'react';
import * as ReactDOM from 'react-dom';

class DefaultLayout extends React.Component<any, any> {

	public render() {
		return <p>React pwnz!</p>;
	}

}

ReactDOM.render(
	React.createElement(DefaultLayout, null),
	document.getElementById('app')
);
