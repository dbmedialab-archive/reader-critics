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
import {LabeledInput} from '../additionalComponents/LabeledInput';
import {SwitchBox} from '../additionalComponents/SwitchBox';

export interface IWebsiteOverrideSettingsContentSection {
	list: string[];
	listPropName: string;
	onSubmit: (data: any) => void;	// TODO replace with correct type
	checkValidation: (value: string, touched: boolean) => string | boolean;
	controlPropName?: string;
	controlPropValue?: boolean;
}

export class WebsiteOverrideSettingsContentSection extends
	React.Component <IWebsiteOverrideSettingsContentSection, any> {

	constructor (props) {
		super(props);
		this.state = {
			value: '',
			touched: false,
		};

		this.onDelete = this.onDelete.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.onKeyPress = this.onKeyPress.bind(this);
		this.onEdit = this.onEdit.bind(this);
		this.onToggleCheck = this.onToggleCheck.bind(this);
		this.getValidationError = this.getValidationError.bind(this);
	}

	getValidationError() {
		const {value, touched} = this.state;
		return this.props.checkValidation(value, touched);
	}

	onDelete (index: number) {
		const {list, listPropName} = this.props;
		if (index >= 0) {
			const overrideList = list;		// TODO get as mutable
			overrideList.splice(index, 1);
			return this.props.onSubmit({overrides: {[listPropName]: overrideList}});
		}
	}

	onSubmit () {
		const {touched, value} = this.state;
		if (touched && value && !this.getValidationError()) {
			const {listPropName, list} = this.props;
			const overrides = {[listPropName]: list.concat(value)};
			this.props.onSubmit({overrides});
			return this.setState({value: '', touched: false});
		}
	}

	onToggleCheck (e) {
		const {controlPropName} = this.props;
		const {checked} = e.target;
		const settings = {[controlPropName]: checked};
		return this.props.onSubmit({settings});
	}

	onKeyPress (e) {
		if (e.key === 'Enter') {
			return this.onSubmit();
		}
	}

	onEdit (e) {
		this.setState({
			value: e.target.value,
			touched: true,
		});
	}

	render () {
		/**
		 * Great luck if I don't burn at the stake for it...
		 */
		// TODO classes
		const {
			controlPropValue = false,
			controlPropName: isControllable,
			list,
			listPropName,
		} = this.props;
		const listEl = list.map((email: string, index: number) => {
			return (
				<li key={`${index}-${listPropName}-override`}
					className="website-feedback-email-override-list-item email-override-list-item">
					{email}
					<i className="fa fa-times" onClick={this.onDelete.bind(this, index)}/>
				</li>);
		});
		const {value, touched} = this.state;
		return (
			<div className="medium-12 columns website-feedback-email-override-container overrides-container">
				<fieldset className="text">
					<div className="row">
						{isControllable &&
						<div className="small-12 columns hide-for-medium columns override-status-control">
							<SwitchBox
								classes={`switch round tiny`}
								ID={'feedback-email-override-status-small'}
								checked={controlPropValue}
								onChange={this.onToggleCheck}
							/>
						</div>}
						<div className={`small-12 ${isControllable && 'medium-9 large-10'} columns`}>
							<LabeledInput
								onSubmit={this.onSubmit}
								errorText={this.getValidationError()}
								onEdit={this.onEdit}
								value={value}
								touched={touched}
								label={
									<span>
										<b>Feedback email override</b><br/>
										Emails to get notifications about feedbacks for articles if needed
										(instead of article authors emails)
									</span>}
								ID={`feedback-email-override`}/>
						</div>
						{isControllable &&
						<div className="medium-3 large-2 show-for-medium columns override-status-control">
							<SwitchBox
								classes={`switch round large`}
								ID={'feedback-email-override-status'}
								checked={controlPropValue}
								onChange={this.onToggleCheck}
							/>
						</div>}
						<div className="small-12 columns">
							<ul className="website-feedback-email-override-list">
								{listEl}
							</ul>
						</div>
					</div>
				</fieldset>
			</div>
		);
	}
}
