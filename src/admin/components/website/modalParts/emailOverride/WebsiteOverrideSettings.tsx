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
import Validator from 'admin/services/Validation';
import * as Immutable from 'seamless-immutable';
import {LabeledInput} from 'admin/components/website/additionalComponents/LabeledInput';
import {SwitchBox} from 'admin/components/website/additionalComponents/SwitchBox';
import {TagList} from 'admin/components/website/additionalComponents/TagList';

export interface IWebsiteOverrideSettings {
	list: string[];
	listPropName: string;
	isControllable?: boolean;
	controlPropName?: string;
	controlPropValue?: boolean;
	label: JSX.Element | string;
	ID: string;
	value: string;
	touched: boolean;
	onSubmit: (data: any) => void;
	onChange: (value:string, touched:boolean) => void;
}

export class WebsiteOverrideSettings extends React.Component <IWebsiteOverrideSettings, any> {
	private readonly validator : Validator;

	constructor (props) {
		super(props);

		this.validator = new Validator();

		this.onDelete = this.onDelete.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.onKeyPress = this.onKeyPress.bind(this);
		this.onEdit = this.onEdit.bind(this);
		this.onToggleCheck = this.onToggleCheck.bind(this);
		this.getValidationError = this.getValidationError.bind(this);
	}

	getValidationError() {
		return this.checkValidation(this.props.controlPropName);
	}

	onDelete (index: number) {
		const {list, listPropName} = this.props;
		if (index >= 0) {
			const overrideList = Immutable(list).asMutable();
			overrideList.splice(index, 1);
			return this.props.onSubmit({overrides: {[listPropName]: overrideList}});
		}
	}

	onSubmit () {
		const {touched, value} = this.props;
		if (touched && value && !this.getValidationError()) {
			const {listPropName, list} = this.props;
			const overrides = {[listPropName]: list.concat(value)};
			this.props.onSubmit({overrides});
		}
	}

	onToggleCheck (e) {
		const {controlPropName} = this.props;
		const {checked} = e.target;
		const settings = {[controlPropName]: checked};
		return this.props.onSubmit({settings});
	}

	onKeyPress (e): void {
		if (e.key === 'Enter') {
			return this.onSubmit();
		}
	}

	onEdit (e) {
		this.props.onChange(e.target.value, true);
	}

	checkValidation(propName: string): string {
		const {value} = this.props;
		const isEmail = this.validator.validate(propName, value, { required: true });

		if (isEmail.isError) {
			return isEmail.message;
		}
		else {
			const isUnique = this.validator.validate('uniqueness',
				this.props.list.concat(value));

			if (isUnique.isError) {
				return isUnique.message;
			}

			return '';
		}
	}

	render () {
		const {
			controlPropValue = false,
			isControllable = false,
			list,
			label,
			ID,
			value,
			touched} = this.props;
		return (
			<div className="medium-12 columns overrides-container">
				<fieldset className="text">
					<div className="row">
						<div className={`small-12 ${isControllable && 'medium-9 large-10'} columns`}>
							<LabeledInput
								onSubmit={this.onSubmit} errorText={this.getValidationError()}
								onEdit={this.onEdit} value={value}	touched={touched}
								label={label}
								ID={ID}/>
						</div>
						{isControllable &&
						<div className="medium-3 large-2 show-for-medium columns override-status-control">
							<SwitchBox
								classes={`switch round large`}	ID={ID}
								checked={controlPropValue} onChange={this.onToggleCheck}
							/>
						</div>}
						<div className="small-12 columns">
							<TagList
								items={ list }
								onDelete={this.onDelete}
								classes="website-settings-list"
								color="blue"
							/>
						</div>
					</div>
				</fieldset>
			</div>);
	}
}
