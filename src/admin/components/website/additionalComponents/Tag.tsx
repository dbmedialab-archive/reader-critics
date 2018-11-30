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
import { WebsiteSection } from 'base/WebsiteSection';

export interface ITag {
	classes: string;
	onDelete: (index: number) => void;
	onEdit: (item: string) => void;
	item: string;
	color?: string;
	id: number;
	isEditing: string;
}

export class Tag extends React.Component <ITag, any> {

	constructor (props: ITag) {
		super(props);
		this.createTag = this.createTag.bind(this);
		this.onEditSection = this.onEditSection.bind(this);
	}

	onEditSection(){
	const  { item } = this.props;
	return this.props.onEdit( item );

	}

	createTag (item: string, color) {
		const {id, classes, onDelete } = this.props;
			return (
				<li key={ `${id}-item` } className={`${classes}-item ${color}`}>
						{WebsiteSection[item]}
					<i className="fa fa-pencil-square-o" aria-hidden="true" onClick={this.onEditSection}/>
					<i className="fa fa-times" aria-hidden="true" onClick={onDelete.bind(this, id)}/>
				</li>
			);
	}

	render () {
		const {classes, item, isEditing} = this.props;
		const colorSection = isEditing === item ? 'red' : 'green';
		return (
			<ul className={classes}>
				{this.createTag(item, colorSection)}
			</ul>
		);
	}
}
