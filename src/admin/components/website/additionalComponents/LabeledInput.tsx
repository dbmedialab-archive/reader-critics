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
import { Label } from 'admin/components/website/additionalComponents/Label';

export interface ILabeledInput {
	onSubmit: () => void;
	errorText: string;
	onEdit: (e) => void;
	value: string;
	touched: boolean;
	label: string | JSX.Element;
	ID: string;
	inputType?: string;
}

export class LabeledInput extends React.Component <ILabeledInput, any> {

	constructor (props) {
		super(props);

		this.onKeyPress = this.onKeyPress.bind(this);
	}

	onKeyPress (e): void {
		if (e.key === 'Enter') {
			return this.props.onSubmit();
		}
	}

	render () {
		const {
			value,
			touched,
			ID,
			onEdit,
			onSubmit,
			errorText,
			label,
			inputType = 'text',
		} = this.props;
		return (
			<div className="row">
				<Label label={label} ID={ID} />
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
