import * as React from 'react';
import '../scss/app.scss';

// Common components
import Header from '../common/Header';
import Footer from '../common/Footer';
import SuggestionContainer from './SuggestionContainer';

const SuggestionLayout : React.StatelessComponent <any> =
	() => <div>
		<Header/>
		<SuggestionContainer/>
		<Footer/>
	</div>;

export default SuggestionLayout;
