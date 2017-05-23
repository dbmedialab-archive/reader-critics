declare var articleURL : string;  // declared externally and set in main template

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './scss/app.scss';

import ArticleConent from './section/ArticleContent';
import Header from './section/Header';
import Footer from './section/Header';

var test = [
	{ type: "paragraph", text: "foo", typeIndex: 1 },
	{ type: "paragraph", text: "foo", typeIndex: 2 },
	{ type: "paragraph", text: "foo", typeIndex: 3 },
	{ type: "paragraph", text: "foo", typeIndex: 4 }
];

class DefaultLayout extends React.Component <any, any> {

	constructor() {
		super();
		this.state = { editing : false };
	}

	public render() : any {
		return (<div>
			<Header />
			<ArticleConent />
			<Footer />
		</div>);
	}

}

ReactDOM.render(
	React.createElement(DefaultLayout, null),
	document.getElementById('app')
);

