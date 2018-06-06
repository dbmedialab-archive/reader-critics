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

export interface ITagList {
	classes: string;
	onDelete: (index: number) => void;
	items: string[];
	color?: string;
}

export class TagList extends React.Component <ITagList, any> {

	constructor (props: ITagList) {
		super(props);
		this.createTags = this.createTags.bind(this);
	}
	createTags (items: string[]) {
		const {classes, onDelete, color = 'blue'} = this.props;
		return items.map((item, index) => {
			return (<li key={index + '-item '} className={`${classes}-item ${color}`}>
				{item}
				<i className="fa fa-times" onClick={onDelete.bind(this, index)}/>
			</li>);
		});
	}

	render () {
		const {classes, items} = this.props;
		return (
			<ul className={classes}>
				{this.createTags(items)}
			</ul>
		);
	}
}
