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
import Article from 'base/Article';

class ArticlesContainer extends React.Component <any, any> {
	constructor (props) {
		super(props);
		this.showFeedbacks = this.showFeedbacks.bind(this);
	}

	componentDidMount () {
		ArticlesActions.getArticleList();
	}

	componentWillUnmount () {
		ArticlesActions.setArticleList([]);
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
		return (
			<Layout pageTitle="Articles">
				<div className="articles-list">
					{articles}
				</div>
			</Layout>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	return {
		articles: state.articles,
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ArticlesContainer);
