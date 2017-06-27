import * as React from 'react';
import * as ReactDOM from 'react-dom';

import FeedbackPageLayout from './feedback/FeedbackPageLayout';
import SuggestionLayout from './suggest/SuggestionLayout';

const apps = {
	'feedback': FeedbackPageLayout,
	'suggestion': SuggestionLayout,
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
