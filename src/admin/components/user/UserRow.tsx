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
		const style = `row expanded user-row remove-enter-row ${this.props.state}`;
		return (
			<div className={style}>
				<div className="column small-3 medium-3"><p>{this.props.name}</p></div>
				<div className="column small-2 medium-2"><p>{this.props.role}</p></div>
				<div className="column small-5 medium-4"><p>{this.props.email}</p></div>
				<div className="column small-2 medium-3">
					<div className="button-group">
						<button onClick={this.onEdit} className="button success" type="button">Edit</button>
						<button onClick={this.onDestroy} className="button alert" type="button">Delete</button>
					</div>
				</div>
			</div>
		);
	}
}
