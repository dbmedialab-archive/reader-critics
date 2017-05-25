import * as React from 'react';
import * as ReactDOM from 'react-dom';
import FloatingActionButton from './component/FloatingActionButton';
import './scss/app.scss';

import ArticleContent from './section/ArticleContent';
import Header from './section/Header';
import Footer from './section/Footer';

class DefaultLayout extends React.Component <any, any> {

	constructor() {
		super();
		this.state = { editing : false };
	}

	public render() : any {
		return (<div>
			<Header />
			<ArticleContent />
			<FloatingActionButton/>
			<Footer />
		</div>);
	}

}

ReactDOM.render(React.createElement(DefaultLayout, null), document.getElementById('app'));
