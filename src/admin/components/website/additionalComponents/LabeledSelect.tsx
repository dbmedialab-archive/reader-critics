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
import { Label } from 'admin/components/website/additionalComponents/Label';

export interface ILabeledSelect {
	onChange: (e) => void;
	value: string;
	label: string | JSX.Element;
	ID: string;
	options: IOption[];
	name: string;
	chosen?: boolean;
	defaultOptionText?: string;
	disabled?: boolean;
}

export interface IOption {
	value: string;
	name: string;
}

export class LabeledSelect extends React.Component <ILabeledSelect, any> {

	constructor (props: ILabeledSelect) {
		super(props);

	}

	createSelectOptions (options: IOption[]) {
		return options.map((option, index) => (
			<option value={option.value} key={option.value}>{option.name}</option>
		));
	}

	render () {
		const {
			ID,
			value,
			onChange,
			name,
			label,
			options,
			chosen = true,
			defaultOptionText = '-- None --',
			disabled,
		} = this.props;

		return (
			<div className="row">
				<Label label={label} ID={ID} />
				<div className="small-12 columns">
					<select
						id={`${ID}-input`}
						value={value || ''}
						className="small-12 large-12"
						onChange={onChange}
						name={name}
						disabled={ disabled }
					>
					{defaultOptionText && !chosen && <option value="">{defaultOptionText}</option> }
					{options.length && this.createSelectOptions(options)}
					</select>
				</div>
			</div>
		);
	}
}
