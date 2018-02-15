//
// LESERKRITIKK v2 (aka Reader Critics)
// Copyright (C) 2017 DB Medialab/Aller Media AS, Oslo, Norway
// https://github.com/dbmedialab/reader-critics/
//
// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.
//
// This program is distributed in the hope that it will be useful, but WITHOUT
// ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
// FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License along with
// this program. If not, see <http://www.gnu.org/licenses/>.
//

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { addLocaleData, IntlProvider } from 'react-intl';

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

const name = rootContainer.getAttribute('name');

if (typeof apps[name] !== 'function') {
	throw new Error(`Unknown app type "${name}"`);
}

const { locale, messages } = (() => {
	if (!(window['app'] && window['app'].localization)) {
		return {
			locale: 'en',
			messages: {},
		};
	}

	return window['app'].localization;
})();

if (window['ReactIntlLocaleData']) {
	addLocaleData(window['ReactIntlLocaleData'][locale]);
}

const rootEl = (<IntlProvider locale={locale} messages={messages}>
	{ React.createElement(apps[name]) }
</IntlProvider>);

ReactDOM.render(rootEl, rootContainer);
