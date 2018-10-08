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

import * as ArticlesActions from 'admin/actions/ArticlesActions';
import * as PaginationActions from 'admin/actions/PaginationActions';
import Article from 'base/Article';
import {defaultLimit} from 'app/services/BasicPersistingService';
import Griddle, {ColumnDefinition, RowDefinition} from 'griddle-react';
import {connect} from 'react-redux';
import SearchFilter from 'admin/components/common/filter/Filter';

export interface IArticlesGriddle {
	articleSelectHandler: (id: number) => void;
	articles: Array<Article>;
	pageCount: number;
}

class ArticlesGriddle extends React.Component <IArticlesGriddle, any> {
	private readonly Layout: (components: any) => JSX.Element;
	private readonly RowEnhancer: (component: any) => (props: any) => JSX.Element;
	private readonly events: any;

	constructor (props: IArticlesGriddle) {
		super(props);
		this.updateArticlesList = this.updateArticlesList.bind(this);
		this.nextHandler = this.nextHandler.bind(this);
		this.prevHandler = this.prevHandler.bind(this);
		this.getPageHandler = this.getPageHandler.bind(this);
		this.generateGridData = this.generateGridData.bind(this);
		this.onSort = this.onSort.bind(this);
		this.onRowSelect = this.onRowSelect.bind(this);
		this.onFilterChange = this.onFilterChange.bind(this);
		this.clear = this.clear.bind(this);

		this.Layout = ({Table, Pagination, Filter, SettingsWrapper}) => (
			<div>
				<Table />
				<Pagination />
			</div>);

		this.RowEnhancer = OriginalComponent =>
			componentProps => (
				<OriginalComponent	{...componentProps}
					onClick={this.onRowSelect.bind(this, componentProps.griddleKey)}
				/>);

		this.events = {
			onNext: this.nextHandler,
			onPrevious: this.prevHandler,
			onGetPage: this.getPageHandler,
			onSort: this.onSort,
		};

		this.state = {
			page: 1,
			limit: defaultLimit,
			sort: '',
			sortOrder: 1,
			search: '',
		};
	}
	get sortProps() {
		const {sort, sortOrder} = this.state;
		return [{id: sort, sortAscending: sortOrder === 1}];
	}
	componentWillMount () {
		return this.updateArticlesList();
	}
	componentWillUnmount () {
		ArticlesActions.clear();
		PaginationActions.clear();
	}
	updateArticlesList() {
		const {page, limit, sort, sortOrder, search} = this.state;
		ArticlesActions.getArticleList(page, limit, sort, sortOrder, search);
	}
	nextHandler() {
		let {page} = this.state;
		this.setState({page: ++page}, this.updateArticlesList);
	}
	prevHandler() {
		let {page} = this.state;
		this.setState({page: --page}, this.updateArticlesList);
	}
	getPageHandler(page: number) {
		this.setState({page}, this.updateArticlesList);
	}
	onSort(sortProps) {
		const {id, sortAscending = false} = sortProps;
		this.setState({
			sort: id,
			sortOrder: sortAscending ? -1 : 1,
		}, this.updateArticlesList);
	}
	onFilterChange(search: string) {
		this.setState({search});
	}
	clear() {
		this.setState({search: ''}, this.updateArticlesList);
	}
	generateGridData() {
		const {articles} = this.props;
		return articles.map((article: Article) => {
			const date = ('date' in article) ? new Date(article.date.created) : new Date(0);
			return {
				title: article.title,
				date: `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`,
				version: article.version || '',
				feedbacks: article.feedbacks || 0,
			};
		});
	}
	onRowSelect(griddleKey: string) {
		const {articles} = this.props;
		const id = articles[parseInt(griddleKey)]['_id'];
		return this.props.articleSelectHandler(id);
	}
	render () {
		const gridArticles = this.generateGridData();
		const {page, limit} = this.state;
		const {pageCount} = this.props;

		return (
			<div>
				<div className="small-12">
					<div className="row expanded">
						<div className="small-12 large-7">
							<SearchFilter
								onSubmit={this.updateArticlesList}
								onChange={this.onFilterChange}
								search={this.state.search}
								clear={this.clear}
							/>
						</div>
					</div>
				</div>
				<Griddle
					data={gridArticles}
					pageProperties={{
						currentPage: page,
						pageSize: limit,
						recordCount: limit * pageCount,
					}}
					events={this.events}
					sortProperties={this.sortProps}
					components={{
						RowEnhancer: this.RowEnhancer,
						Layout: this.Layout,
					}}
					classNames={{
						NoResults: 'griddle-no-results',
					}}
				>
					<RowDefinition>
						<ColumnDefinition id="title" title="Title"/>
						<ColumnDefinition id="date" title="Date"/>
						<ColumnDefinition id="version" title="Version"/>
						<ColumnDefinition id="feedbacks" title="Feedbacks"/>
					</RowDefinition>
				</Griddle>
			</div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ArticlesGriddle);
