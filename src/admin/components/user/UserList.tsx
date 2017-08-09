import * as React from 'react';
import { connect } from 'react-redux';
import UserRow from 'admin/components/user/UserRow';

import * as UIActions from 'admin/actions/UIActions';
import * as AppConstants from 'admin/constants/AppConstants';
import * as UsersActions  from 'admin/actions/UserActions';

class UserList extends React.Component <any, any> {
	constructor(props) {
		super(props);
		this.onCreate = this.onCreate.bind(this);
	}

	componentDidMount() {
		UsersActions.getUsers();
	}

	public onCreate(e: any): void {
		e.preventDefault();
		const windowName = AppConstants.USER_MODAL_NAME;
		UIActions.modalWindowsChangeState(windowName, {isOpen: true});
	}
	public render() : JSX.Element {
		const content = this.props.users.map((user) =>
			<UserRow
				id={user.id}
				key={user.id}
				email={user.email}
				password={user.password}
				profile={user.profile}
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
		users: state.User.users,
		user: state.User.user,
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(UserList);
