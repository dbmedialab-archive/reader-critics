import { Component } from 'react';

import {
	default as axios,
	AxiosResponse,
} from 'axios'

import FeedbackFormContainer from './FeedbackFormContainer';

// Component Properties

interface LayoutProps {
	articleURL : string;
}

// Component State

interface LayoutState {
}

// Default Feedback Layout

export default class FeedbackDefaultLayout extends Component <LayoutProps, LayoutState> {

	private articleRequest : any;

	componentWillMount() {
		console.log(this.props);
	}

	componentDidMount() {
		var _this = this;
		this.articleRequest = axios.get(`/article/get/${this.props.articleURL}`);
		this.articleRequest.then(function(resp : AxiosResponse) {
			console.dir(resp);
			/*_this.setState({
				jobs: resp.data.jobs
			});*/
		});
	}

	componentWillUnmount() {
		this.articleRequest.abort();
	}

	render() {
		return (
			<div id="page-container">
				<div id="main-container">
					<p>This is an example layout. Place feedback form here:</p>
					<FeedbackFormContainer/>
					<p>React pwnz!</p>
				</div>
			</div>
		);
	}

}
