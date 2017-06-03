import * as React from 'react';

import {
	default as axios,
	AxiosResponse,
} from 'axios';

import FeedbackFormContainer from './FeedbackFormContainer';

// Component Properties

export interface FeedbackLayoutProps {
	articleURL : string;
}

// Default Feedback Layout

export default class FeedbackDefaultLayout extends React.Component <FeedbackLayoutProps, void> {

	private articleRequest : any;

	componentWillMount() {
		console.log(this.props);
	}

	componentDidMount() {
		const encodedURL = encodeURIComponent(this.props.articleURL);

		this.articleRequest = axios.get(`/api/article/?url=${encodedURL}`);
		this.articleRequest.then(function(resp : AxiosResponse) {
			console.dir(resp);
			// _this.setState({
			// 	jobs: resp.data.jobs
			// });
		});
	}

	componentWillUnmount() {
		this.articleRequest.abort();
	}

	render() {
		return (
			<div id='page-container'>
				<div id='main-container'>
					<p>This is an example layout. Place feedback form here:</p>
					<FeedbackFormContainer/>
					<p>React pwnz!</p>
				</div>
			</div>
		);
	}

}
