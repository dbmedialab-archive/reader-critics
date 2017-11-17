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

class ArticleHeaderComponent extends React.Component <any, any> {
	constructor (props) {
		super(props);
		this.findTitle = this.findTitle.bind(this);
	}

	findTitle () {
		const {article} = this.props;
		const articleTitleElem = ('items' in article) ?
								article.items.find(item => item.type === 'title') : false;
		return articleTitleElem ? articleTitleElem.text : 'Title not set';
	}

	render () {
		const {article} = this.props;
		const articleDateTimeObj = ('date' in article) ? new Date(article.date.created) : new Date(0);
		const articleDateTime = articleDateTimeObj.toLocaleDateString() + ' '
								+ articleDateTimeObj.toLocaleTimeString();
		const articleTitle = this.findTitle();
		return (
				<div className="article">
					<div className="row expanded time-section">
						<div className="small-12 time-item">
							<i className="fa fa-clock-o"/>
							Created: {articleDateTime}
						</div>
					</div>
					<div className="row expanded article-title-section">
						<div className="small-12 article-text">
							{articleTitle}
						</div>
					</div>
					<div className="row expanded article-url-section">
						<div className={('website' in article && article.website) ? 'small-8' : 'small-12'}>
							<a className="article-url-link" href={article.url} target="_blank">
								{article.url}
							</a>
						</div>
						{('website' in article && article.website) ?
							<div className="small-4 article-website-name">
								<span className="title">Website: </span>
								{article.website.name}
							</div>
							: null
						}
					</div>
				</div>
		);
	}
}

export default ArticleHeaderComponent;
