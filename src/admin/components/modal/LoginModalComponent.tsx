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
import {connect} from 'react-redux';
import ReactModal from './ReactModalComponent';

import * as UIActions from 'admin/actions/UIActions';
import * as UserActions from 'admin/actions/UserActions';
import {InputError} from 'front/form/InputError';
import {sendAuthRequest} from 'admin/apiAdminCommunication';

export interface OptionsI {
	input?: any;
}

class LoginModalComponent extends React.Component <any, any> {

	private loginInput: HTMLInputElement;
	private passwordInput: HTMLInputElement;

	constructor(props) {
		super(props);
		this.state = {
			serverError: {
				value: '',
				touched: false,
			},
		};
		this.getCurrentInput = this.getCurrentInput.bind(this);
		this.updateInputValue = this.updateInputValue.bind(this);
		this.loginUser = this.loginUser.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.setAllTouched = this.setAllTouched.bind(this);
	}

	componentWillMount() {
		UIActions.initModalWindows(this.props.windowName);
		UIActions.showLoginDialog({
			yesBtnName: 'Login',
			dialogTitle: 'Authorization',
			yesHandler: this.loginUser,
		});
	}

	getCurrentInput(propName) {
		const options: OptionsI = {};
		options.input = {};
		options.input[propName] = this.props[propName];
		options.input[propName].touched = true;
		return options;
	}

	updateErrorState(message: string = '', touched: boolean = false): void {
		return this.setState({
			serverError: {
				value: message || '',
				touched,
			},
		});
	}

	updateInputValue(event) {
		const options = this.getCurrentInput(event.target.name);
		options.input[event.target.name].value = event.target.value;
		this.updateErrorState();  // Drop server error
		UIActions.modalWindowsChangeState(this.props.windowName, options);
	}

	hasLoginError(): string | boolean {
		if (!this.props.login.value) {
			return 'Login field has to be filled';
		}
		return false;
	}

	hasPasswordError(): string | boolean {
		if (!this.props.password.value) {
			return 'Password field has to be filled';
		}
		return false;
	}

	isFormValid(): boolean {
		return (!this.hasPasswordError() && !this.hasLoginError());
	}

	loginUser(): void {
		if (this.isFormValid()) {
			UIActions.showMainPreloader();
			const {login: {value: login}, password: {value: password}} = this.props;
			sendAuthRequest({login, password}).then((res: any): void => {
				if (res.error || (!res.success && res.message)) {
					this.updateErrorState(res.error || res.message, true);
				} else {
					UserActions.authenticate(res.data);
					UIActions.hideLoginDialog();
					this.props.getBack();
				}
				UIActions.hideMainPreloader();
			});
		}
	}

	setAllTouched(): void {
		const {password: {touched: password}, login: {touched: login}} = this.props;
		if (!login || !password) {
			const options: OptionsI = {};
			options.input = {
				login: {touched: true},
				password: {touched: true},
			};
			UIActions.modalWindowsChangeState(this.props.windowName, options);
		}
	}

	private handleSubmit(e: any): void {
		e.preventDefault();
		this.setAllTouched();
		return this.loginUser();
	}

	render(): JSX.Element {
		return (
			<ReactModal isOpen={this.props.isOpen} name="loginUser" closeHandler={() => {}}>
				<div className="modal-window">
					<div className="row">
						<div className="medium-12 columns">
							<p className="lead">Authorization</p>
						</div>
					</div>
					<div className="row">
						<div className="medium-12 columns">
							<form onSubmit={this.handleSubmit} className="authentication-form">
								<label htmlFor="login">Login</label>
								<input type="text" name="login" ref={r => this.loginInput = r}
									id="login" value={this.props.login.value}
									onChange={this.updateInputValue} />
								<InputError	errorText={this.hasLoginError()}
									touchedField={this.props.login.touched}	/>
								<label htmlFor="password">Password</label>
								<input type="password" name="password" ref={r => this.passwordInput = r}
									id="password" value={this.props.password.value}
									onChange={this.updateInputValue} />
								<InputError errorText={this.hasPasswordError()}
									touchedField={this.props.password.touched} />
							</form>
						</div>
					</div>
					<div className="row button-holder">
						<div className="medium-12 columns">
							<a onClick={this.handleSubmit} className="button success" href="#">Log IN</a>
						</div>
						<InputError	errorText={this.state.serverError.value}
							touchedField={this.state.serverError.touched} />
					</div>
				</div>
			</ReactModal>
		);
	}
}

const mapStateToProps = (state, ownProps) => ({
	isOpen: state.UI.getIn(['modalWindows', ownProps.windowName, 'isOpen']),
	login: {
		value: state.UI.getIn(['modalWindows', ownProps.windowName, 'input', 'login', 'value'], ''),
		touched:
			state.UI.getIn(['modalWindows', ownProps.windowName, 'input', 'login', 'touched'], false),
	},
	password: {
		value: state.UI.getIn(['modalWindows', ownProps.windowName, 'input', 'password', 'value'], ''),
		touched:
			state.UI.getIn(['modalWindows', ownProps.windowName, 'input', 'password', 'touched'], false),
	},
});

const mapDispatchToProps = (dispatch, ownProps) => ({
	onClick: () => {},
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginModalComponent);
