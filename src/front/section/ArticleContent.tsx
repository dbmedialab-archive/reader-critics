import * as React from 'react';

import ArticleElement from '../component/ArticleElement';

import { fetchArticle } from '../apiCommunication';
import { getArticleURL } from '../uiGlobals';

export interface ArticleContentState {
	article: any;
}

export default class ArticleContent extends React.Component <any, ArticleContentState> {

	constructor() {
		super();
		this.state = {
			article: null,
		};
	}

	componentWillMount() {
		const self = this;
		fetchArticle(getArticleURL(), '').then(article => self.setState({
			article,
		}));
	}

	public render() {
		// Initial state has no article data, render empty
		if (this.state.article === null) {
			return null;
		}

		// Iterate article elements and render sub components
		return <section id='content'>
			{ this.state.article.map(this.createArticleElement) }
		</section>;
	}

	private createArticleElement(item, index : number) {
		const elemKey = `element-${item.order.elem}`;
		return <ArticleElement
			key={elemKey}
			elemOrder={item.order.elem}
			typeOrder={item.order.type}

			type={item.type}
			originalText={item.text}
		/>;
	}

}
