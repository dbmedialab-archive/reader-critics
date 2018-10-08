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

export interface IActionBar {
	griddleKey: number,
	rowData: any,
	value: any,
	cellProperties: any
}

const rowDataSelector = (state, props: IActionBar) => {
	const griddleKey = props.griddleKey;
	return state
		.get('data')
		.find(rowMap => rowMap.get('griddleKey') === griddleKey)
		.toJSON();
};

const enhancedWithRowData = connect((state, props: IActionBar) => {
	return {
		rowData: rowDataSelector(state, props),
		onEdit: props.cellProperties.onEdit,
		onDestroy: props.cellProperties.onDestroy,
	};
});

export interface IAction {
	onEdit: () => void;
}
const ActionBar = ({ value, griddleKey, rowData, onEdit, onDestroy }) => (
	<div>
		<button
			onClick={onEdit}
			data-item={JSON.stringify(rowData)}
			className="button success" type="button">
			Edit
		</button>
		<button
			onClick={onDestroy}
			data-id={rowData.id}
			className="button alert"
			type="button">
			Delete
		</button>
	</div>);

export default enhancedWithRowData(ActionBar);
