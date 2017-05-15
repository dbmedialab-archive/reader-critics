declare var articleURL : string;  // declared externally and set in main template

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {
	default as axios,
	AxiosResponse,
} from 'axios'

import FeedbackFormContainer from './feedback/FeedbackFormContainer';

interface LayoutProps {
	articleURL : string;
}

class DefaultLayout extends React.Component <LayoutProps, any> {

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
		return (<div id="main-container">
			<p>This is an example layout. Place feedback form here:</p>
			<FeedbackFormContainer/>
			<p>React pwnz!</p>
		</div>);
	}

}

ReactDOM.render(
	React.createElement(DefaultLayout, {
		articleURL,
	}),
	document.getElementById('app')
);
