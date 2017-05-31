import * as React from 'react';

import {
	default as axios,
	AxiosPromise,
	AxiosResponse,
} from 'axios';

import ArticleElement from '../component/ArticleElement';

import { getArticleURL } from '../uiGlobals';

export interface ArticleContentState {
	article: any;
}

export default class ArticleContent extends React.Component <any, ArticleContentState> {

	private articleRequest : AxiosPromise;

	constructor() {
		super();
		this.state = {
			article: null,
		};
	}

	componentWillMount() {
		const encodedURL = encodeURIComponent(getArticleURL());
		const self = this;

		console.log('Fetch:', encodedURL);

		this.articleRequest = axios.get(`/api/article/?url=${encodedURL}`);
		this.articleRequest.then(function(resp : AxiosResponse) {
			console.dir(resp);
			self.setState({
				article: resp.data.data.article,
			});
		});
	}

	public render() {
		if (this.state.article === null) {
			return null;
		}

		console.log('ArticleContent state:', this.state);

		const content = this.state.article.map((item, index) => <ArticleElement
			key={this.createKey(item)}
			elemOrder={item.order.elem}
			typeOrder={item.order.type}

			type={item.type}
			text={item.text}
		/>);

		return <section id='content'>
			{content}
		</section>;
	}

	private createKey(item : any) : string {
		return `element-${item.order.elem}`;
	}

	// private createArticleElement(elem : any) : ArticleElement {
	// 	return
	// }

}
