import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './scss/app.scss';
// Common components
import Header from '../section/Header';
import Footer from '../section/Footer';

import SuggestionFormContainer from './SuggestionFormContainer';

class SuggestionLayout extends React.Component <any, any> {

	constructor() {
		super();

	}

	public render() : JSX.Element {
		return (<div>
			<Header />
				<SuggestionFormContainer />
			<Footer />
		</div>);
	}

}

ReactDOM.render(React.createElement(SuggestionLayout, null), document.getElementById('app'));
