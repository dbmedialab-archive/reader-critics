declare var articleURL : string;  // declared externally and set in main template

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './scss/app.scss';

import ArticleContent from './section/ArticleContent';
import Header from './section/Header';
import Footer from './section/Header';

class DefaultLayout extends React.Component <any, any> {

	constructor() {
		super();
		this.state = { editing : false };
	}

	public render() : any {
		return (<div>
			<Header />
			<ArticleContent />
			<Footer />
		</div>);
	}

}

ReactDOM.render(
	React.createElement(DefaultLayout, null),
	document.getElementById('app')
);

