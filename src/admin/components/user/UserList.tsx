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
import { Transition, TransitionGroup } from 'react-transition-group';

import AdminConstants from 'admin/constants/AdminConstants';
import * as UIActions from 'admin/actions/UIActions';
import * as UsersActions from 'admin/actions/UsersActions';

class UserList extends React.Component <any, any> {
	constructor(props) {
		super(props);
		this.state = {
			serverError: {
				value: '',
				touched: false,
			},
		};
		this.updateErrorState = this.updateErrorState.bind(this);
		this.onCreate = this.onCreate.bind(this);
	}

	componentDidMount() {
		UsersActions.getUsers();
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

		const content = this.props.users.map((user) =>
			<Transition key={user.ID} timeout={300}>
				{(state) => (
					<UserRow
						key={user.ID}
						ID={user.ID}
						email={user.email}
						role={user.role}
						name={user.name}
						state={state}
					/>
				)}
			</Transition>
		);
		return (
			<main>
				<section className="row expanded">
					<div className="column small-12">
						<button type="button" onClick={this.onCreate} className="button">Create User</button>
					</div>
				</section>
				<section className="userTable">
					<div className="row expanded">
						<div className="column small-12 users-group-holder">
							<div className="userlist-table-heading">
								<div className="row expanded user-row table-header">
									<div className="column small-3 medium-3">
										<b>Name</b>
									</div>
									<div className="column small-2 medium-2">
										<b>Role</b>
									</div>
									<div className="column small-5 medium-4">
										<b>Email</b>
									</div>
									<div className="column small-2 medium-3">
										<b>Edit</b>
									</div>
								</div>
								<TransitionGroup>
									{content}
								</TransitionGroup>
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
		users: state.users.getIn(['users']) || [],
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(UserList);
