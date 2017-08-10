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
import ReactModal from './ReactModalComponent';
import UserRole from 'base/UserRole';

import * as UsersAction  from 'admin/actions/UserActions';
import * as UIActions from 'admin/actions/UIActions';

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
		this.updateSelectValue = this.updateSelectValue.bind(this);
		this.onBlur = this.onBlur.bind(this);
		this.onFocus = this.onFocus.bind(this);
		this.saveUser = this.saveUser.bind(this);
		this.getUserRoles = this.getUserRoles.bind(this);
		this.makeSelectDom = this.makeSelectDom.bind(this);
		this.isValid = this.isValid.bind(this);
	}

	componentWillMount(){
		UIActions.initModalWindows(this.props.windowName);
	}

	getCurrentInput(propName){
		const options : OptionsI = {};
		options.input = {};
		options.input[propName] = this.props[propName];
		options.input[propName].touched = true;

		return options;
	}

	makeSelectDom(optionsArr){
		return optionsArr.map((optionItem) =>
			<option
				key={optionItem} value={optionItem}>{ capitalizeFirstLetter(optionItem) }
			</option>);
	}

	getUserRoles(){
		const roles = [
			UserRole.SystemAdmin,
			UserRole.SiteAdmin,
			UserRole.Editor,
			UserRole.Normal,
		];
		return this.makeSelectDom(roles);
	}

	isValid(){
		/*let data = {
			email: this.props.email.value,
			name: this.props.name.value,
			role: this.props.role.value,
			password: this.props.password.value,
		};
		if (this.props.userId){
			delete data.password;
		}
		return isValidProps(data);*/
	}

	updateInputValue(event) {
		const options = this.getCurrentInput(event.target.name);
		options.input[event.target.name].value = event.target.value;
		UIActions.modalWindowsChangeState(this.props.windowName, options);
	}
	updateSelectValue(event){
		const options = this.getCurrentInput(event.target.name);
		options.input[event.target.name].value = +event.target.value;
		UIActions.modalWindowsChangeState(this.props.windowName, options);
	}
	closePopup() : void {
		if (this.props.userId){
			UIActions.closeReset(this.props.windowName);
		} else {
			UIActions.modalWindowsChangeState(this.props.windowName, {isOpen: false});
		}
	}
	onFocus(event){
		const name = event.target.name;
		this.props[name].touched = true;
	}
	onBlur(event){
		const options = this.getCurrentInput(event.target.name);
		UIActions.modalWindowsChangeState(this.props.windowName, options);
	}
	saveUser(event): void {
		event.preventDefault();
		const data = {
			email: this.props.email.value,
			password: this.props.password.value,
			id: this.props.userId || null,
			profile: {
				name: this.props.name.value,
				role: this.props.role.value,
			},
		};
		UsersAction.saveUser(data);
	}

	closeReset() : void {
		UIActions.closeReset(this.props.windowName);
	}

	render() : JSX.Element {
		const roles = this.getUserRoles();
		const isDisabled = false;
		/*const isDisabled = this.isValid();*/
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
										id="name"
										onFocus={this.onFocus}
										value={this.props.name.value}
										onBlur={this.onBlur}
										onChange={this.updateInputValue}
									/>
								</fieldset>
							</div>
							<div className="medium-6 columns">
								<fieldset className="text">
									<label htmlFor="email">Email</label>
									<input
										type="email"
										name="email"
										id="email"
										value={this.props.email.value}
										onFocus={this.onFocus}
										onBlur={this.onBlur}
										onChange={this.updateInputValue}
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
										id="email"
										value={this.props.password.value}
										onFocus={this.onFocus}
										onBlur={this.onBlur}
										onChange={this.updateInputValue}
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
												disabled={isDisabled}
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
			value: state.UI.getIn(['modalWindows', ownProps.windowName, 'input', 'name', 'value']) || '',
			touched: state.UI.getIn(['modalWindows', ownProps.windowName, 'input','name', 'touched'])
			|| false,
		},
		email: {
			value: state.UI.getIn(['modalWindows', ownProps.windowName, 'input', 'email', 'value']) || '',
			touched: state.UI.getIn(['modalWindows', ownProps.windowName, 'input', 'email', 'touched'])
			|| false,
		},
		bio: {
			value: state.UI.getIn(['modalWindows', ownProps.windowName, 'input', 'bio', 'value']) || '',
			touched: state.UI.getIn(['modalWindows', ownProps.windowName, 'input', 'bio', 'touched'])
			|| false,
		},
		field: {
			value: state.UI.getIn(['modalWindows', ownProps.windowName, 'input', 'field', 'value']) || '',
			touched: state.UI.getIn(['modalWindows', ownProps.windowName, 'input', 'field', 'touched'])
			|| false,
		},
		role: {
			value: state.UI.getIn(['modalWindows', ownProps.windowName, 'input', 'role', 'value']) || '',
			touched: state.UI.getIn(['modalWindows', ownProps.windowName, 'input', 'role', 'touched'])
			|| false,
		},
		password: {
			value: state.UI.getIn(['modalWindows', ownProps.windowName, 'input', 'password', 'value']) || '',
			touched: state.UI.getIn(['modalWindows', ownProps.windowName, 'input', 'password', 'touched'])
			|| false,
		},
		userId: state.UI.getIn(['modalWindows', ownProps.windowName, 'userId']) || null,
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(AddUserModalComponent);
