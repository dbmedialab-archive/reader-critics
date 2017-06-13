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
		fetchArticle(getArticleURL()).then(article => self.setState({
			article,
		}));
	}

	public render() {
		if (this.state.article === null) {
			return null;
		}

		const content = this.state.article.map((item, index) => <ArticleElement
			key={this.createKey(item)}
			elemOrder={item.order.elem}
			typeOrder={item.order.type}

			type={item.type}
			originalText={item.text}
		/>);

		return <section id='content'>
			{content}
		</section>;
	}

	private createKey(item : any) : string {
		return `element-${item.order.elem}`;
	}

}
