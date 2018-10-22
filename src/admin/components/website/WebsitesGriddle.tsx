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

import Website from 'base/Website';
import AdminConstants from 'admin/constants/AdminConstants';

import { WebsiteProps } from 'admin/types/Website';

import * as UIActions from 'admin/actions/UIActions';
import * as WebsiteActions from 'admin/actions/WebsiteActions';
import User from 'base/User';
import * as UsersActions from 'admin/actions/UsersActions';
import {IUsersGriddle} from 'admin/components/user/UsersGriddle';
import EnhancedActionBar from 'admin/components/common/action/ActionBar';
import {defaultLimit} from 'app/services/BasicPersistingService';
import * as PaginationActions from 'admin/actions/PaginationActions';
import Griddle, {ColumnDefinition, RowDefinition} from 'griddle-react';
import {connect} from 'react-redux';
import SearchFilter from 'admin/components/common/filter/Filter';

export interface IWebsitesGriddle {
	websites: Array<Website>;
	pageCount: number;
}

class WebsitesGriddle extends React.Component <IWebsitesGriddle, any> {
	private readonly events: any;
	constructor(props: IWebsitesGriddle) {
		super(props);
		this.onEdit = this.onEdit.bind(this);
		this.onDestroy = this.onDestroy.bind(this);
		this.updateWebsitesList = this.updateWebsitesList.bind(this);
		this.nextHandler = this.nextHandler.bind(this);
		this.prevHandler = this.prevHandler.bind(this);
		this.getPageHandler = this.getPageHandler.bind(this);
		this.generateGridData = this.generateGridData.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.clear = this.clear.bind(this);
		this.updateModalWindowData = this.updateModalWindowData.bind(this);
		this.state = {
			page: 1,
			limit: defaultLimit,
			sort: '',
			sortOrder: 1,
			search: '',
			filterTouched: false,
		};
		this.events = {
			onNext: this.nextHandler,
			onPrevious: this.prevHandler,
			onGetPage: this.getPageHandler,
		};
	}
	updateModalWindowData(website) {
		const windowName = AdminConstants.WEBSITE_MODAL_NAME;
		const websiteRes = {
			isOpen: true,
		};
		WebsiteActions.setSelectedWebsite(website as Website);
		UIActions.modalWindowsChangeState(windowName, websiteRes);
	}

	public onEdit(e: any) :void {
		e.preventDefault();
		console.log(e.target.dataset.id);
		const websiteId = e.target.dataset.id;
		const {websites} = this.props;
		const website = websites.filter( item => {
			return website ? item.ID = websiteId: null;
		});
		return this.updateModalWindowData(website as Website);
	}
	public onDestroy(e: any) :void {
		e.preventDefault();
		const windowName = AdminConstants.WEBSITE_MODAL_NAME;
		const websiteId = e.target.dataset.id;
		UIActions.modalWindowsChangeState(windowName, {isOpen: false});
		UIActions.showDialog({
			noBtnName: 'Cancel',
			dialogTitle: 'Do you want delete this WEBSITE?',
			yesHandler: () => WebsiteActions.deleteWebsite(websiteId),
		});
	}
	componentWillMount() {
		return this.updateWebsitesList();
	}
	componentWillUnmount() {
		//UsersActions.clear();
		PaginationActions.clear();
	}
	updateWebsitesList() {
		const {page, limit, sort, sortOrder, search} = this.state;
		WebsiteActions.getWebsiteList(page, limit, sort, sortOrder, search);
	}
	onSubmit() {
		const {filterTouched} = this.state;
		filterTouched ? (
			this.setState({page:1}, this.updateWebsitesList),
				this.setState({filterTouched: false})
		) : this.updateWebsitesList();
	}
	nextHandler() {
		let {page} = this.state;
		this.setState({page: ++page}, this.updateWebsitesList);
	}
	prevHandler() {
		let {page} = this.state;
		this.setState({page: --page}, this.updateWebsitesList);
	}
	getPageHandler(page: number) {
		this.setState({page}, this.updateWebsitesList);
	}

	clear() {
		this.setState({search: ''}, this.updateWebsitesList);
	}
	generateGridData() {
		const {websites} = this.props;

		return websites.map((website: Website) => {
			console.log(website);

			const chiefEditors = website.chiefEditors.map(editor => {
				return editor.name;
			});
			console.log(chiefEditors);

			return {
				name: website.name,
				hosts: website.hosts.join(', '),
				chiefEditors: chiefEditors.join(', '),
				parser: website.parserClass,
				id: website.ID,
			};
		});
	}

	render() {
		const {page, limit} = this.state;
		const {pageCount} = this.props;
		const websitesGrid = this.generateGridData();
		return (
			<div>
				<div className="users-group-holder">
					<Griddle data={websitesGrid}
						pageProperties={{currentPage: page, pageSize: limit, recordCount: limit * pageCount}}
						events={this.events}
						components={{
						Filter: () => <span />,
						SettingsToggle: () => <span />,
						}}
					>
						<RowDefinition>
							<ColumnDefinition id="name" title="Name"/>
							<ColumnDefinition id="hosts" title="Hosts"/>
							<ColumnDefinition id="chiefEditors" title="ChiefEditors"/>
							<ColumnDefinition id="parser" title="Parser"/>
							<ColumnDefinition id="id" title="id" visible={false}/>
							<ColumnDefinition id="actions"
																title="Actions"
																onEdit={this.onEdit}
																onDestroy={this.onDestroy}
																customComponent={EnhancedActionBar}
							/>
						</RowDefinition>
					</Griddle>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	return {
		websites: state.website.getIn(['websites']) || [],
		pageCount: state.pagination.getIn(['pageCount'], 1),
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(WebsitesGriddle);

/*
	<div className="row expanded">
					<div className="small-12 large-7">
						<SearchFilter
							onSubmit={this.onSubmit}
							onChange={this.onFilterChange}
							search={this.state.search}
							clear={this.clear}
						/>
					</div>
				</div>

				onFilterChange(search: string) {
		this.setState({search:search, filterTouched:true});
	}
	onSort(sortProps) {
		const {id, sortAscending = false} = sortProps;
		this.setState({
			sort: id,
			sortOrder: sortAscending ? -1 : 1,
		}, this.updateWebsitesList);
	}
	this.onSort = this.onSort.bind(this);
		this.onFilterChange = this.onFilterChange.bind(this);
			onSort: this.onSort,
 */
