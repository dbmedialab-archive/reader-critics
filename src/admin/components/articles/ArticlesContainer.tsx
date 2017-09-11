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
import ArticleComponent from 'admin/components/articles/ArticleComponent';
import * as ArticlesActions from 'admin/actions/ArticlesActions';
import * as PaginationActions from 'admin/actions/PaginationActions';
import Article from 'base/Article';
import PaginationPanel from 'admin/components/layout/Pagination';
import {getPaginationParams} from 'admin/services/Utils';

class ArticlesContainer extends React.Component <any, any> {
	private containerRef;

	constructor (props) {
		super(props);
		this.showFeedbacks = this.showFeedbacks.bind(this);
		this.updateArticlesList = this.updateArticlesList.bind(this);
	}

	componentWillMount () {
		return this.updateArticlesList();
	}

	componentWillUnmount () {
		ArticlesActions.clear();
		PaginationActions.clear();
	}

	componentDidUpdate (nextProps) {
		const {search: newSearch} = nextProps.location;
		const {search} = this.props.location;
		if (search !== newSearch) {
			this.containerRef.scrollTop = 0;
			return this.updateArticlesList();
		}
	}

	updateArticlesList() {
		const {search} = this.props.location;
		const pagination = getPaginationParams(search);
		const {page, limit, sort, sortOrder} = pagination;
		ArticlesActions.getArticleList(page, limit, sort, sortOrder);
	}

	showFeedbacks(ID) {
		const link = `/articles/${ID}`;
		return this.props.history.push(link);
	}

	render () {
		const articles = this.props.articles.map((article: Article) => {
			return <ArticleComponent
				article={article}
				key={article.ID}
				onClick={this.showFeedbacks}
			/>;
		});
		const {search} = this.props.location;
		const pagination = getPaginationParams(search);
		const {page} = pagination;
		return (
			<Layout pageTitle="Articles">
				<div className="articles-list" ref={(ref) => this.containerRef = ref}>
					{articles}
					<PaginationPanel
						current={page}
						total={this.props.pageCount}
						link={`/articles`}
					/>
				</div>
			</Layout>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	return {
		articles: state.articles,
		pageCount: state.pagination.getIn(['pageCount'], 1),
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ArticlesContainer);
