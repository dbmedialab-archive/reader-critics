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
import { InputError } from 'admin/components/form/InputError';

export interface ILabeledInput {
	onSubmit: () => void;
	errorText: string | boolean;
	onEdit: (e) => void;
	value: string;
	touched: boolean;
	label: any;
	ID: string;
	inputType?: string;
}

export class LabeledInput extends React.Component <ILabeledInput, any> {

	constructor (props) {
		super(props);

		this.onKeyPress = this.onKeyPress.bind(this);
	}

	onKeyPress (e) {
		if (e.key === 'Enter') {
			return this.props.onSubmit();
		}
	}

	render () {
		const {value, touched, ID, inputType = 'text', onEdit, onSubmit, errorText, label} = this.props;
		return (
			<div className="row">
				<div className="small-12 columns">
					<label htmlFor={`${ID}-input`}>
						{label}
					</label>
				</div>
				<div className="small-12 columns">
					<input
						id={`${ID}-input`} type={inputType}
						value={value}
						onChange={onEdit}
						onKeyPress={this.onKeyPress} onBlur={onSubmit}
					/>
					<InputError
						errorText={errorText}
						touchedField={touched}
					/>
				</div>
			</div>
		);
	}
}
