import axios from 'axios';
import * as queryString from 'query-string';
import * as React from 'react';

import ArticleBody from '../article/Body';
import Element from '../article/Element';
import ArticleTitle from '../article/Title';
import Header from '../partials/Header';
import ErrorResponse from '../response/ErrorResponse';

export default class Default extends React.Component<any, any> {
	private data: object;
	private error: boolean;

	constructor(props: any) {
		super(props);

		this.error =  false;
		this.state = {
			title: '',
			elements: [],
			error: {},
		};
	}

	componentDidMount() {
		this.fetchData();
	}

	private fetchData() {
		const parsed = queryString.parse(location.search);

		if (typeof parsed.url === 'undefined' || parsed.url === '') {
			this.setError(true);
			this.setState({
				error: {
					success: false,
					message: 'Kunne ikke finnne en gyldig url',
				},
			});
			return;
		}

		const articleUrl = parsed.url;
		axios.get('/article/parse?url=' + articleUrl)
		.then(result => {
			const data = result.data;

			if (!data.success) {
				this.setError(true);
				this.setState({
					error: {
						success: false,
						message: 'Kunne ikke laste inn data, vennligst prøv på nytt',
					},
				});
				return;
			}

			const elements = data.article.elements.map((element) => {
				if (element.type === 'h1' || element.type === 'h2') {
					return <Element key={element.order} text={element.data.text} type={element.type} url={''}/>;
				}

				if (element.type === 'p') {
					return <Element key={element.order} text={element.data.text} type={element.type} url={''} />;
				}

				if (element.type === 'img') {
					return <Element key={element.order} url={element.data.src} type={element.type} text={''}/>;
				}
			});

			this.setState({
				elements: elements,
			});
		});
	}

	public render() {
		if (!this.error) {
			return (
				<ArticleBody elements={this.state.elements} />
			);
		}

		return (
			<ErrorResponse error={this.state.error} />
		);
	}

	public setError(error: boolean) {
		this.error = error;
	}

	public getError(): boolean {
		return this.error;
	}
}
