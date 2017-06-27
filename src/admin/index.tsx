import * as React from 'react';
import * as ReactDOM from 'react-dom';
import TestContainer from './testpage/TestContainer';

const apps = {
	'admin': TestContainer,
};

const rootContainer : HTMLElement = document.getElementById('admin');

if (!rootContainer.hasAttribute('name')) {
	throw new Error('Root <div> container must have a "name" attribute');
}
else {
	const name = rootContainer.getAttribute('name');

	if (typeof apps[name] === 'function') {
		ReactDOM.render(React.createElement(apps[name]), rootContainer);
	}
	else {
		throw new Error(`Unknown app type "${name}"`);
	}
}
