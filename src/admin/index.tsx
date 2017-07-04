import * as React from 'react';
import * as ReactDOM from 'react-dom';

import './scss/admin.scss';

import TestLayout from 'app/routes/admin/ui/testpage/TestLayout';
import LoginLayout from 'app/routes/admin/ui/login/LoginLayout';

const apps = {
	'login': LoginLayout,
	'testpage': TestLayout,
};

const rootContainer : HTMLElement = document.getElementById('app');

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

