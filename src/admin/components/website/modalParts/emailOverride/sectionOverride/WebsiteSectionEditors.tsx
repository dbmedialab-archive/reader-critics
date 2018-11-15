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
import { filter, find } from 'lodash';
import * as mergers from 'seamless-immutable-mergers';

import * as UsersActions from 'admin/actions/UsersActions';

import { LabeledSelect } from 'admin/components/website/additionalComponents/LabeledSelect';
import { WebsiteSection } from 'base/WebsiteSection';
import { WebsiteSectionEditorsItem } from './WebsiteSectionEditorsItem';

class WebsiteSectionEditors extends React.Component <any, any> {
	constructor (props) {
		super(props);
		this.state = {
			touched : false,
			section: null,
			editSection: false,
		};
	}

	componentWillMount() {
		UsersActions.getEditors();
	}

	componentDidUpdate(prevProps){
		const prevSectionEditors = JSON.stringify(prevProps.sectionEditors);
		const sectionEditors = JSON.stringify(this.props.sectionEditors);
		if (sectionEditors !== prevSectionEditors){
			this.props.onTouch(true);
		}
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

	getUsers = ( () => {
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
	});

	onEditSection = ((sectionName) => {
		if (sectionName) {
			this.setState({editSection:true});
			this.setState({section: sectionName});
		}
	});

	onChangeSection  = ((e) => {
		const section = e.target.value;
		const sectionEditors = this.props.sectionEditors.asMutable();
		const isNewSection = !find(sectionEditors, { 'section': section });
		this.setState({editSection:true, touched:true});
		this.setState({section: section});
		if (isNewSection){
			sectionEditors.unshift({section: section, editors: []});
		}
		return this.props.onChange({sectionEditors});
	});

	onChangeEditor =  ((e) => {
		const mergeConfig = {
			merger: mergers.updatingByIdArrayMerger,
			mergerObjectIdentifier: 'section',
			modifier: 'unshift',
		};

		const userID = e.target.value;
		const { section } = this.state;
		this.setState({editSection:false, section: '', touched:true});
		const sectionEditorsAll = this.props.sectionEditors.asMutable();

		if (userID) {
			const newEditor = this.props.users.find(user => user.ID === userID).without(['ID', 'date']);
			const sectionEditorsFiltered = filter(sectionEditorsAll, { 'section': section });
			const editors = sectionEditorsFiltered[0] ? sectionEditorsFiltered[0]['editors'].asMutable()
				: [];
			const isNewEditor = !find(editors, ['name', newEditor.name]);
			if (!isNewEditor){
				return;
			}
			editors.push(newEditor);
			const sectionEditorsObj = immutable({array: sectionEditorsAll});
			const newSectionEditorsItemObj =  immutable({array: [{section: section, editors: editors}]});
			const sectionEditors = sectionEditorsObj.merge(newSectionEditorsItemObj, mergeConfig).array;
			return this.props.onChange({sectionEditors});
		}
	});

	render () {
		const users = this.getUsers();
		const sections = this.makeSectionOptions();
		const { editSection } = this.state;
		const disabled = !editSection;
		return (
			<div className="small-12 medium-9 large-10 columns">
				<fieldset className="text">
					<div className="left">
						<LabeledSelect
							onChange={this.onChangeSection}
							label={ <span><b>Article's Category</b><br/>Choose available category</span> }
							value=""  ID={ `website-section` }
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
							value=""  ID={ `section-editor` }
							options={ users }
							chosen={ false }
							defaultOptionText="-- select --"
							name="parserClass"
							disabled={ disabled } />
					</div>
				</fieldset>
				<WebsiteSectionEditorsItem
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
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(WebsiteSectionEditors);
