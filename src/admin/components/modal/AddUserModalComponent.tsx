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

/*tslint:disable max-file-line-count*/
import * as React from 'react';
import { connect } from 'react-redux';
import { identity, pickBy } from 'lodash';
import ReactModal from './ReactModalComponent';
import UserRole from 'base/UserRole';

import * as UsersAction  from 'admin/actions/UsersActions';
import * as UIActions from 'admin/actions/UIActions';
import { InputError } from 'front/form/InputError';
import { capitalizeFirstLetter } from 'admin/services/Utils';

export interface OptionsI {
	input?: any;
}

class AddUserModalComponent extends React.Component <any, any> {
	constructor(props) {
		super(props);

		this.closePopup = this.closePopup.bind(this);
		this.closeReset = this.closeReset.bind(this);
		this.getCurrentInput = this.getCurrentInput.bind(this);
		this.updateInputValue = this.updateInputValue.bind(this);
		this.onBlur = this.onBlur.bind(this);
		this.onFocus = this.onFocus.bind(this);
		this.saveUser = this.saveUser.bind(this);
		this.hasNameError = this.hasNameError.bind(this);
		this.hasEmailError = this.hasEmailError.bind(this);
		this.hasPasswordError = this.hasPasswordError.bind(this);
		this.makeRolesOptions = this.makeRolesOptions.bind(this);
		this.isFormValid = this.isFormValid.bind(this);
	}

	componentWillMount() {
		UIActions.initModalWindows(this.props.windowName);
	}

	getCurrentInput(propName) {
		const options : OptionsI = {};
		options.input = {};
		options.input[propName] = this.props[propName];
		options.input[propName].touched = true;

		return options;
	}

	makeRolesOptions() {
		return Object.keys(UserRole).map((e, index) =>
			<option key={UserRole[e]} value={UserRole[e]}>{ capitalizeFirstLetter(UserRole[e]) }</option>);

	}

	//TODO replace all validation in the future
	hasNameError(): string | boolean {
		if (this.props.name.value.length < 4) {
			return 'Name has to be more than 3 symbols';
		}
		return false;
	}

	hasEmailError(): string | boolean {
		if (this.props.email.value.length < 4) {
			return 'Please enter valid email address';
		}
		return false;
	}

	hasPasswordError(): string | boolean {
		if (this.props.userId) {
			return false;
		}
		if (this.props.password.value.length < 4) {
			return 'Password has to be more than 3 symbols';
		}
		return false;
	}

	isFormValid(): boolean {
		return (!this.hasNameError() && !this.hasEmailError() && !this.hasPasswordError());
	}

	updateInputValue(event): void {
		const options = this.getCurrentInput(event.target.name);
		options.input[event.target.name].value = event.target.value;
		UIActions.modalWindowsChangeState(this.props.windowName, options);
	}

	closePopup(): void {
		if (this.props.userId){
			UIActions.closeReset(this.props.windowName);
		} else {
			UIActions.modalWindowsChangeState(this.props.windowName, {isOpen: false});
		}
	}

	onFocus(event) {
		const options = this.getCurrentInput(event.target.name);
		options.input[event.target.name].touched = true;
		UIActions.modalWindowsChangeState(this.props.windowName, options);
	}

	onBlur(event) {
		const options = this.getCurrentInput(event.target.name);
		UIActions.modalWindowsChangeState(this.props.windowName, options);
	}

	saveUser(event): void {
		event.preventDefault();
		const {
			email: {value: email},
			password: {value: password},
			userId: ID,
			name: {value: name},
			role: {value: role},
		} = this.props;
		const data = pickBy({email, password, ID, name, role}, identity);
		UsersAction.saveUser(data);
	}

	closeReset(): void {
		UIActions.closeReset(this.props.windowName);
	}

	render(): JSX.Element {
		const roles = this.makeRolesOptions();
		const isDisabled = this.isFormValid();
		return (
			<ReactModal isOpen={this.props.isOpen} name="newUser" closeHandler={this.closePopup}>
				<div className="modal-window">
					<div className="close-btn">
						<i onClick={this.closeReset} className="fa fa-close"/>
					</div>
					<div className="row">
						<div className="medium-12 columns">
							{this.props.userId?
								<p className="lead">Edit user</p>
								:<p className="lead">Add new user</p>
							}
						</div>
					</div>
					<form onSubmit={this.saveUser}>
						<div className="row">
							<div className="medium-6 columns">
								<fieldset className="text">
									<label htmlFor="name">Name</label>
									<input
										type="text"
										name="name"
										onFocus={this.onFocus}
										value={this.props.name.value}
										onBlur={this.onBlur}
										onChange={this.updateInputValue}
									/>
									<InputError
										errorText={this.hasNameError()}
										touchedField={this.props.name.touched}
									/>
								</fieldset>
							</div>
							<div className="medium-6 columns">
								<fieldset className="text">
									<label htmlFor="email">Email</label>
									<input
										type="email"
										name="email"
										value={this.props.email.value}
										onFocus={this.onFocus}
										onBlur={this.onBlur}
										onChange={this.updateInputValue}
									/>
									<InputError
										errorText={this.hasEmailError()}
										touchedField={this.props.email.touched}
									/>
								</fieldset>
							</div>
						</div>
						<div className="row">
							<div className="medium-6 columns">
								<fieldset className="text">
									<label htmlFor="password">Password</label>
									<input
										type="password"
										name="password"
										value={this.props.password.value}
										onFocus={this.onFocus}
										onBlur={this.onBlur}
										onChange={this.updateInputValue}
									/>
									<InputError
										errorText={this.hasPasswordError()}
										touchedField={this.props.password.touched}
									/>
								</fieldset>
							</div>
							<div className="medium-6 columns">
								<label htmlFor="role">Role</label>
								<select onBlur={this.onBlur}
												onFocus={this.onFocus}
												onChange={this.updateInputValue}
												value={this.props.role.value}
												name="role">
									{roles}
								</select>
							</div>
						</div>
						<div className="row button-holder">
							<div className="medium-12 columns">
								<button type="button"
												disabled={!isDisabled}
												onClick={this.saveUser}
												className="button">Save
								</button>
								<button type="button"
												onClick={this.closeReset}
												className="secondary button cancel-button">Cancel
								</button>
							</div>
						</div>
					</form>
				</div>
			</ReactModal>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	return {
		isOpen: state.UI.getIn(['modalWindows', ownProps.windowName, 'isOpen']),
		name: {
			value: state.UI.getIn(['modalWindows', ownProps.windowName, 'input', 'name', 'value'], ''),
			touched: state.UI.getIn(['modalWindows', ownProps.windowName, 'input','name', 'touched'],
				false),
		},
		email: {
			value: state.UI.getIn(['modalWindows', ownProps.windowName, 'input', 'email', 'value'],
				''),
			touched: state.UI.getIn(['modalWindows', ownProps.windowName, 'input', 'email', 'touched'],
				false),
		},
		role: {
			value: state.UI.getIn(['modalWindows', ownProps.windowName, 'input', 'role', 'value'],
				UserRole.Journalist),
			touched: state.UI.getIn(['modalWindows', ownProps.windowName, 'input', 'role', 'touched'],
				false),
		},
		password: {
			value: state.UI.getIn(['modalWindows', ownProps.windowName, 'input', 'password', 'value'],
				''),
			touched: state.UI.getIn(['modalWindows', ownProps.windowName, 'input', 'password', 'touched'],
				false),
		},
		userId: state.UI.getIn(['modalWindows', ownProps.windowName, 'userId'], null),
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(AddUserModalComponent);
