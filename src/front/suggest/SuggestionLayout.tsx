import * as React from 'react';
import '../scss/app.scss';

// Common components
import Header from 'front/common/Header';
import Footer from 'front/common/Footer';
import SuggestionContainer from 'front/suggest/SuggestionContainer';

const SuggestionLayout : React.StatelessComponent <any> =
	() => <div>
		<Header/>
		<SuggestionContainer/>
		<Footer/>
	</div>;

export default SuggestionLayout;
