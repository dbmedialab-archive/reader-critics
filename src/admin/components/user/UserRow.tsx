import * as React from 'react';
import { UserProps } from 'admin/types/User';
import AdminConstants from 'admin/constants/AdminConstants';

import * as UIActions from 'admin/actions/UIActions';
import * as UsersAction  from 'admin/actions/UsersActions';

export interface UserRowState {
	editing? : boolean;
}

export default class UserRow extends React.Component <UserProps, UserRowState> {
	constructor(props: UserProps) {
		super(props);

		this.onEdit = this.onEdit.bind(this);
		this.onDestroy = this.onDestroy.bind(this);
	}

	public onEdit(e: any) :void {
		e.preventDefault();
		const windowName = AdminConstants.USER_MODAL_NAME;
		const user = this.props;
		const userRes = {
			input: {},
			isOpen: true,
			userId: this.props.ID || null,
		};
		userRes.input['name'] = { value: user.name };
		userRes.input['email'] = { value: user.email };
		userRes.input['role'] = { value: user.role };
		userRes.input['password'] = { value: user.password };
		UIActions.modalWindowsChangeState(windowName, userRes);
	}

	public onDestroy(e: any) :void {
		e.preventDefault();
		const windowName = AdminConstants.USER_MODAL_NAME;
		UIActions.modalWindowsChangeState(windowName, {isOpen: false});
		UIActions.showDialog({
			noBtnName: 'Cancel',
			dialogTitle: 'Do you want delete this user?',
			yesHandler: () => UsersAction.deleteUser(this.props.ID),
		});
	}

	public render (): JSX.Element {
		return (
			<div className="row expanded user-row">
				<div className="column small-3 medium-3"><p>{this.props.name}</p></div>
				<div className="column small-2 medium-2"><p>{this.props.role}</p></div>
				<div className="column small-5 medium-4"><p>{this.props.email}</p></div>
				<div className="column small-2 medium-3">
					<div className="button-group">
						<button onClick={this.onEdit} className="button" type="button success">Edit</button>
						<button onClick={this.onDestroy} className="button alert" type="button">Delete</button>
					</div>
				</div>
			</div>
		);
	}
}
