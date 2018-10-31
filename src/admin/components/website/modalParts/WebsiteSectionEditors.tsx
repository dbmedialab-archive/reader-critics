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
import * as UsersActions from 'admin/actions/UsersActions';

import { LabeledSelect } from 'admin/components/website/additionalComponents/LabeledSelect';
import { TagList } from 'admin/components/website/additionalComponents/TagList';

import { connect } from 'react-redux';
import {capitalizeFirstLetter} from 'admin/services/Utils';
import WebsiteSection from 'base/WebsiteSection';

class WebsiteSectionEditors extends React.Component <any, any> {
	constructor (props) {
		super(props);
		this.onDelete = this.onDelete.bind(this);
		this.onChange = this.onChange.bind(this);
		this.getUsers = this.getUsers.bind(this);
	}

	componentWillMount() {
		UsersActions.getEditors();
	}

	makeSectionOptions() {
		return Object.keys(WebsiteSection).map((e, index) => ({
			value: WebsiteSection[e], name: capitalizeFirstLetter(WebsiteSection[e]),
		}));
	}

	////<option key={WebsiteSection[e]} value={WebsiteSection[e]}>{ capitalizeFirstLetter(WebsiteSection[e]) }</option>);
	private getUsers () {
		return this.props.users.asMutable()
			.filter((user) => {
				// Filter away users that are already selected as editor
				for (const editor of this.props.chiefEditors) {
					if (editor.email === user.email) {
						return false;
					}
				}
				return true;
			}).map((user) => (
				{value: user.ID, name: user.name}
			));
	}

	onDelete (index) {
		if (index >= 0) {
			const sectionEditors = this.props.chiefEditors.asMutable();
			sectionEditors.splice(index, 1);
			return this.props.onChange({sectionEditors});
		}
	}

	onChange (e) {
		const userID = e.target.value;
		if (userID) {
			const newUser = this.props.users.find(user => user.ID === userID).without(['ID', 'date']);
			const sectionEditors = this.props.sectionEditors.asMutable();
			sectionEditors.push(newUser);
			e.target.value = '';
			return this.props.onChange({sectionEditors});
		}
	}

	render () {
		const sectionEditors = this.props.chiefEditors.map((item) => item.name);
		const users = this.getUsers();
		const sections = this.makeSectionOptions();
		return (
			<div className="medium-12 columns">
				<div className="left">
					<fieldset className="text">
						<LabeledSelect
							onChange={this.onChange}
							label={<span>
									<b>Article's Category</b><br/>
									Choose available category
								</span>
							}
							value=""
							ID={`website-section`}
							options={ sections }
							chosen={ false }
							defaultOptionText="-- select --"
							name="parserClass"
						/>
						<TagList
							items={ sectionEditors }
							onDelete={this.onDelete}
							classes="website-settings-list"
							color="green"
						/>
					</fieldset>
				</div>
				<div className="right">
					<fieldset className="text">
						<LabeledSelect
							onChange={this.onChange}
							label={<span>
								<b>Category's Editors</b><br/>
								Choose available editors here (roles "Editor" and "Site Admin")
							</span>
							}
							value=""
							ID={`section-editor`}
							options={ users }
							chosen={ false }
							defaultOptionText="-- select --"
							name="parserClass"
						/>
						<TagList
							items={ sectionEditors }
							onDelete={this.onDelete}
							classes="website-settings-list"
							color="green"
						/>
					</fieldset>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	return {
		sectionEditors: state.website.getIn(['selected', 'sectionEditors']),
		users: state.users.getIn(['users'], []),
		hosts: state.website.getIn(['selected', 'hosts']),
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(WebsiteSectionEditors);
