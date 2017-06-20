import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './scss/app.scss';
// Common components

import SuggestionFormContainer from './SuggestionFormContainer';

const SuggestionLayout : React.StatelessComponent <any> =
	() => <div>
					<SuggestionFormContainer />
				</div>;

export default SuggestionLayout;
