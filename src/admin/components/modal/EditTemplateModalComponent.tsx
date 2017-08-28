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
import ReactModal from './ReactModalComponent';
import UserRole from 'base/UserRole';

import * as UsersAction  from 'admin/actions/UsersActions';
import * as UIActions from 'admin/actions/UIActions';
import { InputError } from 'front/form/InputError';
import { capitalizeFirstLetter } from 'admin/services/Utils';

export interface OptionsI {
	input?: any;
}

class EditTemplateModalComponent extends React.Component <any, any> {
	constructor(props) {
		super(props);

		this.closePopup = this.closePopup.bind(this);
		this.closeReset = this.closeReset.bind(this);
		this.getCurrentInput = this.getCurrentInput.bind(this);
		this.updateInputValue = this.updateInputValue.bind(this);
		this.onBlur = this.onBlur.bind(this);
		this.onFocus = this.onFocus.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
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

	closeReset(): void {
		UIActions.closeReset(this.props.windowName);
	}

	onSubmit(): void {
		//TODO validation needed
		this.props.onSubmit(this.props.template.value);
		return this.closeReset();
	}

	render(): JSX.Element {
		return (
			<ReactModal isOpen={this.props.isOpen} name="edit-template" closeHandler={this.closePopup}>
				<div className="modal-window">
					<div className="close-btn">
						<i onClick={this.closeReset} className="fa fa-close"/>
					</div>
					<div className="row">
						<div className="medium-12 columns">
							<p className="lead">Edit Template</p>
						</div>
					</div>
					<form onSubmit={()=>null}>
						<div className="row">
							<div className="medium-12 columns">
								<fieldset className="text">
									<label htmlFor="template">Template</label>
									<textarea
										name="template"
										onFocus={this.onFocus}
										value={this.props.template.value}
										onBlur={this.onBlur}
										onChange={this.updateInputValue}
									/>
									<InputError
										errorText={''}
										touchedField={this.props.template.touched}
									/>
								</fieldset>
							</div>
						</div>
						<div className="row button-holder">
							<div className="medium-12 columns">
								<button type="button"
												disabled={false}
												onClick={this.onSubmit}
												className="button">
									Save
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
		template: {
			value: state.UI.getIn(['modalWindows', ownProps.windowName, 'input', 'template', 'value']) || '',
			touched: state.UI.getIn(
				['modalWindows', ownProps.windowName, 'input', 'template', 'touched']) || '',
		},
		websiteName: state.UI.getIn(['modalWindows', ownProps.windowName, 'websiteName']) || '',
		onSubmit: state.UI.getIn(['modalWindows', ownProps.windowName, 'onSubmit']),
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(EditTemplateModalComponent);
