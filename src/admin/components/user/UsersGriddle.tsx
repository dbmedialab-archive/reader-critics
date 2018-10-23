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
import AdminConstants from 'admin/constants/AdminConstants';
import {defaultLimit} from 'app/services/BasicPersistingService';
import * as UIActions from 'admin/actions/UIActions';
import * as UsersActions from 'admin/actions/UsersActions';
import User from 'base/User';
import Griddle, {ColumnDefinition, RowDefinition} from 'griddle-react';
import * as PaginationActions from 'admin/actions/PaginationActions';
import {connect} from 'react-redux';
import SearchFilter from 'admin/components/common/filter/Filter';
import EnhancedActionBar from 'admin/components/common/action/ActionBar';

export interface IUsersGriddle {
	users: Array<User>;
	pageCount: number;
}

class UsersGriddle extends React.Component <IUsersGriddle, any> {
	private readonly events: any;
	constructor(props: IUsersGriddle) {
		super(props);
		this.onEdit = this.onEdit.bind(this);
		this.onDestroy = this.onDestroy.bind(this);
		this.updateUsersList = this.updateUsersList.bind(this);
		this.nextHandler = this.nextHandler.bind(this);
		this.prevHandler = this.prevHandler.bind(this);
		this.getPageHandler = this.getPageHandler.bind(this);
		this.generateGridData = this.generateGridData.bind(this);
		this.onSort = this.onSort.bind(this);
		this.onFilterChange = this.onFilterChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.clear = this.clear.bind(this);
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
			onSort: this.onSort,
			onGetPage: this.getPageHandler,
		};
	}

	updateModalWindowData(user: User) {
		const windowName = AdminConstants.USER_MODAL_NAME;
		const userRes = {
			input: {},
			isOpen: true,
			userId: user.ID || null,
		};
		userRes.input['name'] = { value: user.name };
		userRes.input['email'] = { value: user.email };
		userRes.input['role'] = { value: user.role };
		userRes.input['password'] = { value: user.password };
		UIActions.modalWindowsChangeState(windowName, userRes);
	}

	public onEdit(e: any) :void {
		e.preventDefault();
		const { users } = this.props;
		const userId = e.target.dataset.id;
		const user = users.filter( item => {
			return item ? item.ID === userId: null;
		});
		if (user){
			this.updateModalWindowData(user[0]);
		}
	}

	public onDestroy(e: any) :void {
		e.preventDefault();
		const windowName = AdminConstants.USER_MODAL_NAME;
		const userId = e.target.dataset.id;
		UIActions.modalWindowsChangeState(windowName, {isOpen: false});
		UIActions.showDialog({
			noBtnName: 'Cancel',
			dialogTitle: 'Do you want delete this user?',
			yesHandler: () => UsersActions.deleteUser(userId),
		});
	}
	componentWillMount() {
		return this.updateUsersList();
	}
	componentWillUnmount() {
		UsersActions.clear();
		PaginationActions.clear();
	}
	updateUsersList() {
		const {page, limit, sort, sortOrder, search} = this.state;
		UsersActions.getUsers(page, limit, sort, sortOrder, search);
	}
	onSubmit() {
		const {filterTouched} = this.state;
		filterTouched ? (
			this.setState({page:1}, this.updateUsersList),
			this.setState({filterTouched: false})
		) : this.updateUsersList();
	}
	nextHandler() {
		let {page} = this.state;
		this.setState({page: ++page}, this.updateUsersList);
	}
	prevHandler() {
		let {page} = this.state;
		this.setState({page: --page}, this.updateUsersList);
	}
	getPageHandler(page: number) {
		this.setState({page}, this.updateUsersList);
	}
	onFilterChange(search: string) {
		this.setState({search:search, filterTouched:true});
	}
	onSort(sortProps) {
		const {id, sortAscending = false} = sortProps;
		this.setState({
			sort: id,
			sortOrder: sortAscending ? -1 : 1,
		}, this.updateUsersList);
	}
	clear() {
		this.setState({search: ''}, this.updateUsersList);
	}
	generateGridData() {
		const {users} = this.props;
		return users.map((user) => {
			return {
				name: user.name,
				role: user.role,
				email: user.email,
				id: user.ID,
			};
		});
	}
	render() {
		const {page, limit} = this.state;
		const {pageCount} = this.props;
		const usersGrid = this.generateGridData();
		return (
			<div>
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
				<div className="users-group-holder">
					<Griddle data={usersGrid}
						pageProperties={{currentPage: page, pageSize: limit, recordCount: limit * pageCount}}
						events={this.events}
						components={{
							Filter: () => <span />,
							SettingsToggle: () => <span />,
						}}
					>
						<RowDefinition>
							<ColumnDefinition id="name" title="Name"/>
							<ColumnDefinition id="role" title="Role"/>
							<ColumnDefinition id="email" title="Email"/>
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
		users: state.users.getIn(['users']) || [],
		pageCount: state.pagination.getIn(['pageCount'], 1),
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(UsersGriddle);
