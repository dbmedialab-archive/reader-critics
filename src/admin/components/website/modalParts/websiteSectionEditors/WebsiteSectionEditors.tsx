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

import { connect } from 'react-redux';

import * as immutable from 'seamless-immutable';
import * as _ from 'lodash';
import * as mergers from 'seamless-immutable-mergers';

import * as UsersActions from 'admin/actions/UsersActions';

import { LabeledSelect } from 'admin/components/website/additionalComponents/LabeledSelect';
import { TagList } from 'admin/components/website/additionalComponents/TagList';

import WebsiteSection from 'base/WebsiteSection';
import WebSectionEditorsItem from './WebsiteSectionEditorsItem';

class WebsiteSectionEditors extends React.Component <any, any> {
	constructor (props) {
		super(props);
		this.state = {
			section: null,
			newSection: false,
			editSection: false,
		};
		this.onDeleteSection = this.onDeleteSection.bind(this);
		this.onChangeEditor = this.onChangeEditor.bind(this);
		this.onChangeSection = this.onChangeSection.bind(this);
		this.onEditSection = this.onEditSection.bind(this);
		this.getUsers = this.getUsers.bind(this);
	}

	componentWillMount() {
		UsersActions.getEditors();
	}

	makeSectionOptions() {
		const { sectionEditors } = this.props;
		const sectionsInUse = sectionEditors.map((item)=> {
			return item.section;
		});
		const sectionsAll =  Object.keys(WebsiteSection).map((e, index) => ({
			value: e, name: WebsiteSection[e],
		}));
		return sectionsAll.filter((section)=>{
			for (const item of sectionsInUse) {
				if (item === section.value) {
					return false;
				}
			}
			return true;
		});
	}

	private getUsers () {
		const {users, chiefEditors} = this.props;
		return users.asMutable()
			.filter((user) => {
				// Filter away users that are already selected as chief-editor
				for (const editor of chiefEditors) {
					if (editor.email === user.email) {
						return false;
					}
				}
				return true;
			}).map((user) => (
				{value: user.ID, name: user.name}
			));
	}

	onDeleteSection (index) {
		if (index >= 0) {
			const sectionEditors = this.props.sectionEditors.asMutable();
			sectionEditors.splice(index, 1);
			this.setState({editSection:false, newSection:false, section: ''});
			return this.props.onChange({sectionEditors});
		}
	}

	onEditSection(sectionName) {
		if (sectionName) {
			this.setState({editSection:true});
			this.setState({section: sectionName});
		}
	}

	onChangeSection (e) {
		const section = e.target.value;
		this.setState({section: section, newSection:true});
	}

	onChangeEditor (e) {
		const mergeConfig = {
			merger: mergers.updatingByIdArrayMerger,
			mergerObjectIdentifier: 'section',
			modifier: 'unshift',
		};

		const userID = e.target.value;
		const { section } = this.state;
		this.setState({newSection:false, editSection:false, section: ''});
		const sectionEditorsAll = this.props.sectionEditors.asMutable();

		if (userID) {
			const newEditor = this.props.users.find(user => user.ID === userID).without(['ID', 'date']);
			const sectionEditorsFiltered = _.filter(sectionEditorsAll, { 'section': section });
			const editors = sectionEditorsFiltered[0] ? sectionEditorsFiltered[0]['editors'].asMutable()
				: [];
			const isNewEditor = !_.find(editors, ['name', newEditor.name]);
			if (!isNewEditor){
				return;
			}
			editors.push(newEditor);
			const sectionEditorsObj = immutable({array: sectionEditorsAll});
			const newSectionEditorsItemObj =  immutable({array: [{section: section, editors: editors}]});
			const sectionEditors = sectionEditorsObj.merge(newSectionEditorsItemObj, mergeConfig).array;
			return this.props.onChange({sectionEditors});
		}
	}

	renderTagSection(){
		const section = this.state.section;
		return (
			<fieldset className="text">
				<div className="left">
					<TagList
						items={[WebsiteSection[section]]}
						onDelete={this.onDeleteSection}
						classes="website-settings-list"
						color="green"
					/>
				</div>
			</fieldset>);
	}

	render () {
		const users = this.getUsers();
		const sections = this.makeSectionOptions();
		const newSectionTag = this.renderTagSection();
		const { newSection, editSection } = this.state;
		const disabled = !newSection && !editSection;
		return (
			<div className="medium-12 columns">
				<fieldset className="text">
					<div className="left">
						<LabeledSelect
							onChange={this.onChangeSection}
							label={ <span><b>Article's Category</b><br/>Choose available category</span> }
							value=""
							ID={ `website-section` }
							options={ sections }
							chosen={ false }
							defaultOptionText="-- select --"
							name="parserClass" />
					</div>
					<div className="right">
						<LabeledSelect
							onChange={this.onChangeEditor}
							label={ <span><b>Category's Editors</b><br/>
								Choose available editors here (roles "Editor" and "Site Admin") </span> }
							value=""
							ID={ `section-editor` }
							options={ users }
							chosen={ false }
							defaultOptionText="-- select --"
							name="parserClass"
							disabled={ disabled } />
					</div>
				</fieldset>
				{ newSection && newSectionTag }
				<WebSectionEditorsItem
					sectionEditors={this.props.sectionEditors}
					onChange={this.props.onChange}
					onEdit={this.onEditSection}
					isEditing={this.state.section} />
			</div>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	return {
		sectionEditors: state.website.getIn(['selected', 'sectionEditors']),
		chiefEditors: state.website.getIn(['selected', 'chiefEditors']),
		users: state.users.getIn(['users'], []),
		hosts: state.website.getIn(['selected', 'hosts']),
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(WebsiteSectionEditors);
