import * as React from 'react';

import ArticleElement from 'front/component/ArticleElement';

import { fetchArticle } from 'front/apiCommunication';
import { getArticleURL } from 'front/uiGlobals';

export interface FeedbackContainerState {
	article: any;
}

export default class FeedbackContainer
extends React.Component <any, FeedbackContainerState> {

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
