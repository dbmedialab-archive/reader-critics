import * as axios from 'axios';
import * as queryString from 'query-string';
import * as React from 'react';

import ArticleHeader from '../article/Header';
import ArticleParagraph from '../article/Paragraph';
import ArticleTitle from '../article/Title';
import Header from '../partials/Header';

export default class Default extends React.Component<any, any> {
	private data: object;

	constructor(props: any) {
		super(props);

		this.state = {
			title: '',
			elements: [],
		};
	}

	componentDidMount() {
		this.fetchData();
	}

	private fetchData() {
		console.log('Fetching data');
		const parsed = queryString.parse(location.search);

		if (typeof parsed.url === 'undefined' || parsed.url === '') {
			// TODO: Return some kinda error to the user here
			return {};
		}

		const articleUrl = parsed.url;
		axios.get('/article/parse?url=' + articleUrl)
		.then(result => {
			console.log(result);
			const data = result.data;

			if (!data.success) {
				// TODO: Return failure message to user or try again?
				return {};
			}

			const elements = data.article.elements.map((element) => {
				if (element.type === 'h1') {
					return <h1>{element.data.text}</h1>;
				}

				if (element.type === 'h2') {
					return <h2>{element.data.text}</h2>;
				}

				if (element.type === 'p') {
					return <p>{element.data.text}</p>;
				}
			});

			this.setState({
				elements: elements,
			});
			console.log(this.state);
			console.log('Fetching data complete');
		});
	}

	public render() {
		return (
			<ArticleParagraph elements={this.state.elements} />
		);
	}
}
