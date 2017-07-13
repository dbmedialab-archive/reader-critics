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
import { connect } from 'react-redux';
import ReactModal from './ReactModalComponent';

//import * as UsersAction  from 'admin/actions/UsersActions';
import * as UIActions from 'admin/actions/UIActions';

export interface OptionsI {
	input?: any;
}

class AddUserModalComponent extends React.Component <any, any> {
	private usernameInput : any;
	private emailInput : any;

	constructor(props) {
		super(props);

		this.closePopup = this.closePopup.bind(this);
		this.closeReset = this.closeReset.bind(this);
		this.getCurrentInput = this.getCurrentInput.bind(this);
		this.updateInputValue = this.updateInputValue.bind(this);
		this.updateSelectValue = this.updateSelectValue.bind(this);
		this.saveUser = this.saveUser.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
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

	componentWillReceiveProps(nextProps){}

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

	saveUser(event): void {}

	closeReset() : void {
		UIActions.closeReset(this.props.windowName);
	}

	private handleSubmit(e: any) : void {
		e.preventDefault();
	}

	render() : JSX.Element {
		return (
			<ReactModal isOpen={this.props.isOpen} name="newUser" closeHandler={this.closePopup}>
				<div className="modalWindow">
					<div className="closeBtn">
						<i onClick={this.closeReset} className="fa fa-close"></i>
					</div>
					<div className="row">
						<div className="medium-12 columns">
							{this.props.id?
								<p className="lead">Edit user</p>
								:<p className="lead">Add new user</p>
							}
						</div>
					</div>
					<form onSubmit={this.handleSubmit}>
						<div className="row">
							<div className="medium-12 columns">
								<fieldset className="text">
									<label htmlFor="comment">Name</label>
									<input
										type="text"
										name="name"
										ref={r => this.usernameInput = r}
										id="name"
										value={this.props.name.value}
										onChange={this.updateInputValue}
									/>
								</fieldset>
							</div>
						</div>
						<div className="row">
							<div className="medium-12 columns">
								<fieldset className="text">
									<label htmlFor="email">Email</label>
									<input
										type="email"
										name="email"
										ref={r => this.emailInput = r}
										id="email"
										value={this.props.email.value}
										onChange={this.updateInputValue}
									/>
								</fieldset>
							</div>
						</div>
						<div className="row button_holder">
							<div className="medium-12 columns">
								<a onClick={this.saveUser} className="button" href="#">Save</a>
								<a onClick={this.closeReset} className="secondary button cancel_button" href="#">Cancel</a>
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
			touched:
				state.UI.getIn(['modalWindows', ownProps.windowName, 'input','name', 'touched']) || false,
		},
		email: {
			value:
				state.UI.getIn(['modalWindows', ownProps.windowName, 'input', 'email', 'value']) || '',
			touched:
				state.UI.getIn(['modalWindows', ownProps.windowName, 'input', 'email', 'touched']) || false,
		},
		userId: state.UI.getIn(['modalWindows', ownProps.windowName, 'id']),
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		onClick: () => {
		},
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(AddUserModalComponent);
