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
import { UserProps } from 'admin/types/User';
import AdminConstants from 'admin/constants/AdminConstants';
import {defaultLimit} from 'app/services/BasicPersistingService';

import * as UIActions from 'admin/actions/UIActions';
import * as UsersActions from 'admin/actions/UsersActions';

import Griddle, {ColumnDefinition, RowDefinition} from 'griddle-react';
import User from 'base/User';
import * as PaginationActions from 'admin/actions/PaginationActions';
import * as ArticlesActions from 'admin/actions/ArticlesActions';
import {connect} from 'react-redux';

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
		//this.getPageHandler = this.getPageHandler.bind(this);
		this.generateGridData = this.generateGridData.bind(this);
		//this.onSort = this.onSort.bind(this);
		//this.onFilterChange = this.onFilterChange.bind(this);
		//this.clear = this.clear.bind(this);

		this.state = {
			page: 1,
			limit: 10,
			sort: '',
			sortOrder: 1,
			search: '',
		};
		this.events = {
			onNext: this.nextHandler,
			onPrevious: this.prevHandler,
			//onGetPage: this.getPageHandler,
			//onSort: this.onSort,
		};
	}

	public onEdit(e: any) :void {
		console.log(this);
		e.preventDefault();
		const windowName = AdminConstants.USER_MODAL_NAME;
		const item = JSON.parse(e.target.dataset.item);
		const userRes = {
			input: {},
			isOpen: true,
			userId: item.id || null,
		};
		userRes.input['name'] = { value: item.name };
		userRes.input['email'] = { value: item.email };
		userRes.input['role'] = { value: item.role };
		userRes.input['password'] = { value: item.password };
		UIActions.modalWindowsChangeState(windowName, userRes);
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
		ArticlesActions.clear();
		PaginationActions.clear();
	}

	updateUsersList() {
		const {page, limit, sort, sortOrder, search} = this.state;
		UsersActions.getUsers(page, limit, sort, sortOrder, search);
	}

	nextHandler() {
		let {page} = this.state;
		this.setState({page: ++page}, this.updateUsersList);
	}

	prevHandler() {
		let {page} = this.state;
		this.setState({page: --page}, this.updateUsersList);
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
		const rowDataSelector = (state, props) => {
			const griddleKey = props.griddleKey;
			return state
				.get('data')
				.find(rowMap => rowMap.get('griddleKey') === griddleKey)
				.toJSON();
		};

		const enhancedWithRowData = connect((state, props) => {
			return {
				rowData: rowDataSelector(state, props),
			};
		});

		const ActionBar = ({ value, griddleKey, rowData }) => (
			<div>
				<button
					onClick={this.onEdit}
					data-item={JSON.stringify(rowData)}
					className="button success" type="button">
					Edit
				</button>
				<button
					onClick={this.onDestroy}
					data-id={rowData.id}
					className="button alert"
					type="button">
					Delete
				</button>
			</div>);

		const usersGrid = this.generateGridData();
		return (
			<section>
				<Griddle data={usersGrid}
					pageProperties={{
					 currentPage: page,
					 pageSize: limit,
					 recordCount: limit * pageCount,
					}}
					events={this.events}
				>
					<RowDefinition>
						<ColumnDefinition id="name" title="Name"/>
						<ColumnDefinition id="role" title="Role"/>
						<ColumnDefinition id="email" title="Email"/>
						<ColumnDefinition id="id" title="id" visible={false}/>
						<ColumnDefinition id="actions"
								title="Actions"
								customComponent={enhancedWithRowData(ActionBar)}
						/>
					</RowDefinition>
				</Griddle>
			</section>
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
