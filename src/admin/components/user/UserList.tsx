//
// LESERKRITIKK v2 (aka Reader Critics)
// Copyright (C) 2017 DB Medialab/Aller Media AS, Oslo, Norway
// https://github.com/dbmedialab/reader-critics/
//
// This program is free software: you can redistribute it and/or modify it
// under
// the terms of the GNU General Public License as published by the Free
// Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.
//
// This program is distributed in the hope that it will be useful, but WITHOUT
// ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
// FITNESS
// FOR A PARTICULAR PURPOSE. See the GNU General Public License for more
// details.  You should have received a copy of the GNU General Public License
// along with this program. If not, see <http://www.gnu.org/licenses/>.
import * as React from 'react';
import { connect } from 'react-redux';
import UserRow from 'admin/components/user/UserRow';

import AdminConstants from 'admin/constants/AdminConstants';
import * as UIActions from 'admin/actions/UIActions';
import * as UserActions from 'admin/actions/UserActions';

class UserList extends React.Component <any, any> {
	constructor(props) {
		super(props);
		this.state = {
			serverError: {
				value: '',
				touched: false,
			},
			users: [
				{
					'id': '5964e04c6a2f9c5fae26625c',
					'email': 'valo44n1x@gmail.com',
					'role': 'admin',
					'name': 'Valeriy',
				},
			],
		};
		this.updateErrorState = this.updateErrorState.bind(this);
		this.onCreate = this.onCreate.bind(this);
	}

	componentDidMount() {
		UserActions.getUsers();
	}

	public onCreate(e: any): void {
		e.preventDefault();
		const windowName = AdminConstants.USER_MODAL_NAME;
		UIActions.modalWindowsChangeState(windowName, {isOpen: true});
	}
	updateErrorState(message: string = '', touched: boolean = false): void {
		return this.setState({
			serverError: {
				value: message || '',
				touched,
			},
		});
	}
	public render() : JSX.Element {
		//TODO edit to props instead of state when backend will works
		const content = this.state.users.map((user) =>
			<UserRow
				id={user.id}
				key={user.id}
				email={user.email}
				role={user.role}
				name={user.name}
			/>
	);
		return (
			<main>
				<section>
					<button type="button" onClick={this.onCreate} className="button">Create User</button>
				</section>
				<section className="userTable">
					<div className="row expanded">
						<div className="column small-12 users_group_holder">
							<div className="userlist_table_heading">
								<div className="row user_row table_header">
									<div className="column small-4 medium-4">
										<b>Name</b>
									</div>
									<div className="column small-4 medium-3">
										<b>Email</b>
									</div>
									<div className="column small-3 medium-3">
										<b>Edit</b>
									</div>
									<div className="column small-1 medium-2">
										<b>Delete</b>
									</div>
								</div>
								{ content }
							</div>
						</div>
					</div>
				</section>
			</main>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	return {
		users: state.user.users,
		login: {
			value: state.UI.getIn(['modalWindows', ownProps.windowName, 'input', 'login', 'value']) || '',
			touched:
			state.UI.getIn(['modalWindows', ownProps.windowName, 'input', 'login', 'touched']) || false,
		},
		password: {
			value: state.UI.getIn(['modalWindows', ownProps.windowName, 'input', 'password', 'value']) || '',
			touched:
			state.UI.getIn(['modalWindows', ownProps.windowName, 'input', 'password', 'touched']) || false,
		},
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(UserList);
