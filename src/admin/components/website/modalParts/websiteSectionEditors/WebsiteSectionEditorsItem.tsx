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
import { TagList } from 'admin/components/website/additionalComponents/TagList';
import { Tag } from 'admin/components/website/additionalComponents/Tag';
import * as immutable from 'seamless-immutable';

export class WebsiteSectionEditorsItem extends React.Component <any, any> {
	constructor (props) {
		super(props);
		this.onDeleteSection = this.onDeleteSection.bind(this);
		this.onDeleteEditor = this.onDeleteEditor.bind(this);
		this.onEditSection = this.onEditSection.bind(this);
	}

	onDeleteSection (index) {
		if (index >= 0) {
			const sectionEditors = this.props.sectionEditors.asMutable();
			sectionEditors.splice(index, 1);
			return this.props.onChange({sectionEditors});
		}
	}

	onEditSection (sectionName) {
		if (sectionName) {
			return this.props.onEdit(sectionName);
		}
	}

	onDeleteEditor (index) {
		const sectionEditorsAll = this.props.sectionEditors;
		// index looks like 0-0, 1-0 ...
		// where the first part - index of the editor in the editors list
		// the second part - index of the item in the sectionEditors list
		// [{section: "News", editors: [{name: "Name", role: "editor"}, ...]}]
		const sectionIndex = index.split('-')[1];
		const editorIndex = index.split('-')[0];
		const editors = sectionEditorsAll[sectionIndex].editors.asMutable();
		if (editorIndex >= 0){
			editors.splice(editorIndex, 1);
		}
		const newEditorsItem = {section: sectionEditorsAll[sectionIndex].section, editors: editors};
		const sectionEditors = immutable.set(sectionEditorsAll, sectionIndex, newEditorsItem);
		return this.props.onChange({sectionEditors});
	}

	render () {
		return this.props.sectionEditors.map((item, index) => {
			const section = item.section;
			const id = index;
			const editors = item.editors.map((el) =>  el.name);
			return (
				<div>
					{section &&
					<fieldset className="text">
						<div className="left">
							<Tag
								id={ id }
								item={ section }
								onDelete={ this.onDeleteSection }
								onEdit={ this.onEditSection }
								classes="website-settings-list"
								isEditing={this.props.isEditing}
							/>
						</div>
						<div className="right">
							<TagList
								id={ id }
								items={ editors }
								onDelete={ this.onDeleteEditor }
								classes="website-settings-list"
								color="green"
							/>
						</div>
					</fieldset>
					}
				</div>
			);
		});
	}
}
