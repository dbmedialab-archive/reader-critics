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

import * as React from 'react';
import 'front/scss/fb.scss';

import Article from 'base/Article';
import FeedbackItem from 'base/FeedbackItem';

import FinishButton from 'front/feedback/FinishButton';
import ArticleElement from 'front/component/ArticleElement';
import PostFeedbackContainer from 'front/feedback/PostFeedbackContainer';

import {
	fetchArticle,
	sendFeedback,
} from 'front/apiCommunication';

import {
	getArticleURL,
	getArticleVersion,
} from 'front/uiGlobals';

export interface FeedbackContainerState {
	article: Article;
	sent: boolean;
}

export default class FeedbackContainer
extends React.Component <any, FeedbackContainerState> {

	private articleElements : ArticleElement[] = [];

	constructor() {
		super();
		this.state = {
			article: null,
			sent: false,
		};
	}

	componentWillMount() {
		const self = this;
		fetchArticle(getArticleURL(), getArticleVersion()).then(article => {
			// FIXME ganz mieser Hack:
			window['app'].article.version = article.version;
			console.log('set version to:', window['app'].article.version);
			self.setState({
				article,
			});
		});
	}
	private createArticleElement(item, index : number) {
		const elemKey = `element-${item.order.item}`;
		return <ArticleElement
			key={elemKey}
			ref={(i : any) => { this.articleElements.push(i); }}
			elemOrder={item.order.item}
			typeOrder={item.order.type}

			type={item.type}
			originalText={item.text}
		/>;
	}

	public sendFeedback() {
		const items : FeedbackItem[] = this.articleElements
			.map((element : ArticleElement) => element.getCurrentData())
			.filter((item : FeedbackItem) => item !== null);

		if (items.length <= 0) {
			alert('The feedback is still empty, nothing was sent');
			return;
		}

		const user = this.demoUsers[Math.floor(Math.random() * this.demoUsers.length)];

		sendFeedback({
			article: {
				url: getArticleURL(),
				version: getArticleVersion(),
			},
			user,
			feedback: {
				items,
			},
		})
		.then((response) => {
			//alert('Feedback successfully sent');
			this.setState({sent : true});
		});
	}

	public render() {
		if (!this.state.sent) {
			return (
				<div className="confirmation">
					<div className="container">
						<div className="row section frontpage">
							<div className="content u-full-width">
								<PostFeedbackContainer />
							</div>
						</div>
					</div>
				</div>
			);
		}
		// Initial state has no article data, render empty
		if (this.state.article === null) {
			return null;
		}

		// Iterate article elements and render sub components
		return <section id="content">
			{ this.state.article.items.map(this.createArticleElement.bind(this)) }
			<FinishButton SendForm={() => this.sendFeedback()} />
		</section>;
	}

	private readonly demoUsers : Object[] = [
		{
			name: 'Indiana Horst',
			email: 'horst@indiana.net',
		}, {
			name: 'Schmitz\' Katze',
		}, {
			name: 'Ragnhild Esben Hummel',
		}, {
			name: 'Finn Hans Nilsen',
		}, {
			name: 'Oddmund Thomas Rasmussen',
		}, {
			name: 'Ruth Lovise Amundsen',
		}, {
			name: 'Kjellfrid Ola Wolff',
		}, {
			email: 'prost.mahlzeit@lulu.org',
		}, {
			email: 'Christen.Mikael@storstrand.no',
		}, {
			email: 'elin@gro.org',
		}, {
			email: 'stein.ha@alexandersen.net',
		}, {
			email: 'ma_re@skjeggestad.org',
		}, {
			email: 'kresten.steensen@koeb.dk',
		}, {
			email: 'ejvind@jacobsen.name',
		},
	];

}
