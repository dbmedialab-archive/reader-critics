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
import * as PaginationActions from 'admin/actions/PaginationActions';
import ArticleHeaderComponent from 'admin/components/article/ArticleHeaderComponent';
import ArticleFeedbackItemComponent from 'admin/components/article/ArticleFeedbackItemComponent';
import FeedbackItem from 'base/FeedbackItem';
import PaginationPanel from 'admin/components/layout/Pagination';
import {getPaginationParams} from 'admin/services/Utils';

class ArticleContainer extends React.Component <any, any> {
	private containerRef;
	constructor (props) {
		super(props);

		this.getFeedbacks = this.getFeedbacks.bind(this);
		this.updateFeedbacksList = this.updateFeedbacksList.bind(this);
	}

	componentWillMount () {
		const {id} = this.props.match.params;
		ArticleActions.getArticle(id);
		this.updateFeedbacksList();
	}

	componentWillUnmount () {
		ArticleActions.clear();
		PaginationActions.clear();
	}

	componentDidUpdate (nextProps) {
		const {search: newSearch} = nextProps.location;
		const {search} = this.props.location;
		if (search !== newSearch) {
			this.containerRef.scrollTop = 0;
			return this.updateFeedbacksList();
		}
	}

	updateFeedbacksList() {
		const {id} = this.props.match.params;
		const {search} = this.props.location;
		const pagination = getPaginationParams(search);
		const {page, limit, sort, sortOrder} = pagination;
		ArticleActions.getArticleFeedbacks(id, page, limit, sort, sortOrder);
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
					article: feedback.article,
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
		const {search} = this.props.location;
		const pagination = getPaginationParams(search);
		const {page} = pagination;
		return (
			<Layout pageTitle="Article">
				<div className="article-view" ref={(ref) => this.containerRef = ref}>
					<div className="article-container">
						<ArticleHeaderComponent article={this.props.article}/>
					</div>
					<div className="article-feedbacks-container">
						{feedbacks}
					</div>
					<PaginationPanel
						current={page}
						total={this.props.pageCount}
						link={`/articles/${this.props.match.params.id}`}
					/>
				</div>
			</Layout>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	return {
		article: state.article.getIn(['article'], {}),
		feedbacks: state.article.getIn(['feedbacks'], []),
		pageCount: state.pagination.getIn(['pageCount'], 1),
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ArticleContainer);
