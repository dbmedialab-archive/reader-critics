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

import Website from 'base/Website';
import AdminConstants from 'admin/constants/AdminConstants';

import {defaultLimit} from 'app/services/BasicPersistingService';
import EnhancedActionBar from 'admin/components/common/action/ActionBar';
import Griddle, {ColumnDefinition, RowDefinition} from 'griddle-react';
import * as PaginationActions from 'admin/actions/PaginationActions';
import * as UIActions from 'admin/actions/UIActions';
import * as WebsiteActions from 'admin/actions/WebsiteActions';

export interface IWebsitesGriddle {
	websites: Array<Website>;
	pageCount: number;
}

class WebsitesGriddle extends React.Component <IWebsitesGriddle, any> {
	private readonly events: any;
	constructor(props: IWebsitesGriddle) {
		super(props);
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
	updateModalWindowData = (website: Website) => {
		const windowName = AdminConstants.WEBSITE_MODAL_NAME;
		const websiteRes = {
			isOpen: true,
		};
		WebsiteActions.setSelectedWebsite(website);
		UIActions.modalWindowsChangeState(windowName, websiteRes);
	}
	onEdit = (e: any) :void => {
		e.preventDefault();
		const websiteId = e.target.dataset.id;
		const { websites } = this.props;
		const website = websites.filter( item => {
			return item ? item.ID === websiteId: null;
		});
		if (website){
			return this.updateModalWindowData(website[0]);
		}
	}
	onDestroy = (e: any) :void => {
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
		PaginationActions.clear();
	}
	updateWebsitesList = () => {
		const {page, limit, sort, sortOrder, search} = this.state;
		WebsiteActions.getWebsiteList(page, limit, sort, sortOrder, search);
	}
	onSubmit = () => {
		const {filterTouched} = this.state;
		filterTouched ? (
			this.setState({page:1}, this.updateWebsitesList),
				this.setState({filterTouched: false})
		) : this.updateWebsitesList();
	}
	nextHandler = () => {
		let {page} = this.state;
		this.setState({page: ++page}, this.updateWebsitesList);
	}
	prevHandler = () => {
		let {page} = this.state;
		this.setState({page: --page}, this.updateWebsitesList);
	}
	getPageHandler = (page: number) => {
		this.setState({page}, this.updateWebsitesList);
	}
	clear = () => {
		this.setState({search: ''}, this.updateWebsitesList);
	}
	generateGridData = () => {
		const {websites} = this.props;

		return websites.map((website: Website) => {
			const chiefEditors = website.chiefEditors.map(editor => {
				return editor.name;
			});

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
							<ColumnDefinition id="sites-actions"
									title="Websites Actions"
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
