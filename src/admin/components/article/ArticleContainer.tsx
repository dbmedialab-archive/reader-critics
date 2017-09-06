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
import {connect} from 'react-redux';

import Layout from 'admin/components/layout/LayoutComponent';
import * as ArticleActions from 'admin/actions/ArticleActions';
import ArticleHeaderComponent from 'admin/components/article/ArticleHeaderComponent';
import ArticleFeedbackItemComponent from 'admin/components/article/ArticleFeedbackItemComponent';
import FeedbackItem from 'base/FeedbackItem';

class ArticleContainer extends React.Component <any, any> {
	constructor (props) {
		super(props);

		this.getFeedbacks = this.getFeedbacks.bind(this);
	}

	componentWillMount () {
		const {id} = this.props.match.params;
		ArticleActions.getArticle(id);
		ArticleActions.getArticleFeedbacks(id);
	}

	componentWillUnmount () {
		ArticleActions.clear();
	}

	getFeedbacks () {
		const {article, feedbacks} = this.props;
		if (!('items' in article) || !feedbacks.length) {
			return null;
		}
		return this.props.feedbacks.map(feedback => {
			return feedback.items.map((feedbackItem: FeedbackItem)=>{
				const feedbackObj = {
					date: feedback.date,
					...feedbackItem,
				};
				return <ArticleFeedbackItemComponent
					feedback={feedbackObj}
					key={feedback.article.ID+'_'+feedbackItem.order.item}
					articleItem={this.props.article.items.find(
						item =>
							(item.order.type === feedbackObj.order.type) &&
							(item.order.item === feedbackObj.order.item))}
				/>;
			});
		});
	}

	render () {
		const feedbacks = this.getFeedbacks();
		return (
			<Layout pageTitle="Article">
				<div className="article-view">
					<div className="article-container">
						<ArticleHeaderComponent article={this.props.article}/>
					</div>
					<div className="article-feedbacks-container">
						{feedbacks}
					</div>
				</div>
			</Layout>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	return {
		article: state.article.getIn(['article'], {}),
		feedbacks: state.article.getIn(['feedbacks'], []),
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ArticleContainer);
