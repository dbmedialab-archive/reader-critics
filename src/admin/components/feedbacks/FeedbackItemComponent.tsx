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
import {diffToReactElem} from 'base/diff';

class FeedbackItemComponent extends React.Component <any, any> {
	constructor(props) {
		super(props);
		this.getFeedbackText = this.getFeedbackText.bind(this);
		this.textDiff = this.textDiff.bind(this);
	}
	renderFeedbackLinks(feedbackLinks){
		return feedbackLinks.map((feedbackLink, index)=>{
				return (
					<a href={feedbackLink} key={index} className="link-item">
						<i className="fa fa-external-link" />
						{feedbackLink}
					</a>);

		});
	}
	// Calculates and highlights the diff of two sentences.
	// Used to preview changes to the text done by the user.
	protected textDiff(text1 : string = '', text2 : string) : any {
		return text2 === undefined ? text1 : diffToReactElem(text1, text2);
	}
	getFeedbackText() {
		const {feedback} = this.props;
		let originalText = feedback.text;
		const originalItemsArr = feedback.article.items.filter(
			i => i.order.type === feedback.order.type && i.order.item === feedback.order.item
		);
		if (originalItemsArr.length) {
			if (!originalText) {
				originalText = originalItemsArr[0].text;
			} else {
				originalText = this.textDiff(originalItemsArr[0].text, originalText);
			}
		}
		return originalText;
	}
	render(){
		const {feedback} = this.props;
		const feedbackDateTimeObj = new Date(feedback.date.created);
		const	feedbackDateTime = feedbackDateTimeObj.toLocaleDateString() + ' '
					+ feedbackDateTimeObj.toLocaleTimeString();
		const feedbackLinks = this.renderFeedbackLinks(feedback.links);
		const feedbackText = this.getFeedbackText();
		return (
			<div className="feedback-item">
				<div className="row expanded time-section">
					<div className="small-12  time-item">
						<i className="fa fa-clock-o" />
						{feedbackDateTime}
					</div>
				</div>
				<div className="row expanded article-url-section">
					<div className="small-12">
						<a className="article-url-link" href={feedback.article.url} target="_blank">
							{feedback.article.url}
						</a>
					</div>
				</div>
				<div className="row expanded feedback-section">
					<div className="small-12 feedback-text">
						{feedbackText}
					</div>
				</div>
				{feedback.comment?
				<div className="row expanded comment-section">
					<div className="small-12">
						<div className="item-label">User comment</div>
					</div>
					<div className="small-12 comment-item">
						{feedback.comment}
					</div>
				</div>
				:null}
				{feedbackLinks.length?
				<div className="row expanded links-section">
					<div className="small-12">
						<div className="item-label">Links</div>
					</div>
					<div className="small-12">
						<div className="links-container">
							{feedbackLinks}
						</div>
					</div>
				</div>
				:null}
			</div>
	);
	}
}
export default FeedbackItemComponent;
