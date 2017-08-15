import * as React from 'react';
import { UserProps } from 'admin/types/User';
import AdminConstants from 'admin/constants/AdminConstants';

import * as UIActions from 'admin/actions/UIActions';
import * as UsersAction  from 'admin/actions/UserActions';

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
			userId: this.props.id || null,
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
			yesHandler: () => UsersAction.deleteUser(this.props.id),
		});
	}

	public render (): JSX.Element {
		return (
			<div className="row expanded user-row">
				<div className="column small-5 medium-5"><p>{this.props.name}</p></div>
				<div className="column small-5 medium-4"><p>{this.props.email}</p></div>
				<div className="column small-2 medium-3">
					<button onClick={this.onEdit} className="button" type="button success">Edit</button>
					<button onClick={this.onDestroy} className="button alert" type="button">Delete</button>
				</div>
			</div>
		);
	}
}
