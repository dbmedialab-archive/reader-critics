declare var articleURL : string;  // declared externally and set in main template

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import FeedbackDefaultLayout from './feedback/FeedbackDefaultLayout';


ReactDOM.render(
	React.createElement(FeedbackDefaultLayout, {
		articleURL,
	}),
	document.getElementById('app')
);
