//
// LESERKRITIKK v2 (aka Reader Critics)
// Copyright (C) 2017 DB Medialab/Aller Media AS, Oslo, Norway
// https://github.com/dbmedialab/reader-critics/
//
// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.
//
// This program is distributed in the hope that it will be useful, but WITHOUT
// ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
// FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License along with
// this program. If not, see <http://www.gnu.org/licenses/>.
//

import * as classnames from 'classnames';
import * as React from 'react';

import 'front/scss/fb.scss';

import createArticleElement from 'front/component/createArticleElement';
import Article from 'base/Article';
import FeedbackItem from 'base/FeedbackItem';
import FinishButton from 'front/feedback/FinishButton';
import PostFeedbackContainer from 'front/feedback/PostFeedbackContainer';
import Spinner from 'front/common/Spinner';

import { ArticleElement } from 'front/component/ArticleElement';
import { FormattedMessage } from 'react-intl';
import { fetchArticle, sendFeedback } from 'front/apiCommunication';
import { getArticleURL, getArticleVersion } from 'front/uiGlobals';

export interface FeedbackContainerState {
	article : Article
	articleItems : Array <FeedbackItem>
	isFeedbackReady : boolean
	isSending : boolean
	gotServerError : boolean
	updateToken? : string
}

export default class FeedbackContainer
extends React.Component <any, FeedbackContainerState> {

	private readonly articleElements : ArticleElement[] = [];
	private finishBtn : FinishButton;

	constructor(props) {
		super(props);
		this.state = {
			article: null,
			isFeedbackReady: false,
			articleItems: [],
			gotServerError: false,
			isSending: false,
		};
	}

	componentWillMount() {
		const self = this;
		fetchArticle(getArticleURL(), getArticleVersion()).then(article => {
			window['app'].article.version = article.version;
			self.setState({
				article,
			});
		}).catch(err => {
			console.error(err.message);
			this.setState({gotServerError: true});
		});
	}

	public onChange() {
		let changedItems = 0;
		this.articleElements.forEach((elem, index) => {
			if (elem.hasData()) {
				changedItems += 1;
			}
		});
		if (changedItems > 0) {
			this.finishBtn.enable(<FormattedMessage
				id="fb.message.form-has-input"
				values={{
					count: changedItems,
				}}
			/>);
		}
		else {
			this.finishBtn.disable(<span>No changes so far</span>);
		}
	}

	private nextFeedbackStep() {
		this.setState({
			isSending: true,
		});
		const items : FeedbackItem[] = this.articleElements
			.filter((element : ArticleElement) => element.hasData())
			.map((element : ArticleElement) => element.getCurrentData());

		if (items.length <= 0) {
			alert(<FormattedMessage id="fb.errors.emptyErr"/>);
			return;
		}
		sendFeedback({
			article: {
				url: getArticleURL(),
				version: getArticleVersion(),
			},
			feedback: {
				items,
			},
		})
		.then((response) => {
			this.setState({
				isFeedbackReady: true,
				isSending: false,
				articleItems: items,
				updateToken: response.updateToken,
			});
		});
	}

	public render() {
		const { isFeedbackReady, isSending } = this.state;
		return (
			<div>
				{ isFeedbackReady && this.renderConfirmationPage() }
				{ !isFeedbackReady && !isSending && this.renderFeedbackForm() }
				{ isSending &&  <Spinner/> }
			</div>
		);
	}

	private renderFeedbackForm() {
		const {article, gotServerError} = this.state;

		// Initial state has no article data, render loading while not gotten server error
		if (article === null) {
			return !gotServerError ? <Spinner/> : null;
		}

		const refFn = (i : any) => { this.articleElements.push(i); };
		const sendFn = () => this.nextFeedbackStep.call(this);

		// Iterate article elements and render sub components
		return (
			<section id="content">
				<this.IntroHelpBox/>
				{ article.items.map(item => createArticleElement(this, item, refFn)) }
				<FinishButton SendForm={sendFn} ref={r => this.finishBtn = r}/>
			</section>
		);
	}

	private renderConfirmationPage() {
		return (
			<div className="confirmation">
				<div className="container">
					<div className="row section frontpage">
						<div className="content u-full-width">
							<PostFeedbackContainer updateToken={this.state.updateToken} />
						</div>
					</div>
				</div>
			</div>
		);
	}

	private readonly IntroHelpBox = () => (
		<div className={classnames('card', 'helpbox')}>
			<h1><FormattedMessage id="fb.helpbox.title"/></h1>
			<p><FormattedMessage id="fb.helpbox.text"/></p>
		</div>
	)
}
