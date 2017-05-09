import * as React from 'react';
import * as ReactDOM from 'react-dom';

import MainBanzaii from './MainBanzaii';

class DefaultLayout extends React.Component<any, any> {

	public render() {
		return (<div id="main-container">
			<p>This is an example layout. Place feedback form here:</p>
			<MainBanzaii/>
			<p>React pwnz!</p>
		</div>);
	}

}

ReactDOM.render(
	React.createElement(DefaultLayout, null),
	document.getElementById('app')
);
