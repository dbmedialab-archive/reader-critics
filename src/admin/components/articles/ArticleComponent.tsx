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

class ArticleComponent extends React.Component <any, any> {
	constructor (props) {
		super(props);
		this.findTitle = this.findTitle.bind(this);
		this.onURLClick = this.onURLClick.bind(this);
		this.onClick = this.onClick.bind(this);
	}

	findTitle () {
		const {article} = this.props;
		const articleTitleElem = article.items.find(item => item.type === 'title');
		return articleTitleElem ? articleTitleElem.text : 'Title not set';
	}

	onURLClick (e) {
		e.stopPropagation();
	}

	onClick() {
		const {article} = this.props;
		return this.props.onClick(article.ID);
	}

	render () {
		const {article} = this.props;
		const articleDateTimeObj = ('date' in article) ? new Date(article.date.created) : new Date(0);
		const articleDateTime = articleDateTimeObj.toLocaleDateString() + ' '
								+ articleDateTimeObj.toLocaleTimeString();
		const articleTitle = this.findTitle();
		return (
			<div className="article" onClick={this.onClick}>
				<div className="row expanded time-section">
					<div className="small-10 time-item">
						<i className="fa fa-clock-o"/>
						{articleDateTime}
					</div>
					<div className="small-2 feedbacks-count-item">
						<i className="fa fa-comments"/>
						{article.feedbacks || 0}
					</div>
				</div>
				<div className="row expanded article-title-section">
					<div className="small-12 article-text">
						{articleTitle}
					</div>
				</div>
				<div className="row expanded article-url-section">
					<div className={('website' in article && article.website) ? 'small-10' : 'small-12'}>
						<a className="article-url-link" href={article.url} target="_blank" onClick={this.onURLClick}>
							{article.url}
						</a>
					</div>
					{('website' in article && article.website) ?
						<div className="small-2 article-website-name">
							{article.website.name}
						</div>
						: null
					}
				</div>
			</div>
		);
	}
}

export default ArticleComponent;
