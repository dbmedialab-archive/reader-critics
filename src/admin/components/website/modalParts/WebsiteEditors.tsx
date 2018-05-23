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

import { LabeledSelect } from '../additionalComponents/LabeledSelect';
import { TagList } from 'admin/components/website/additionalComponents/TagList';

import { connect } from 'react-redux';

class WebsiteEditors extends React.Component <any, any> {
	constructor (props) {
		super(props);
		this.onDelete = this.onDelete.bind(this);
		this.checkHost = this.checkHost.bind(this);
		this.onChange = this.onChange.bind(this);
		this.getUsers = this.getUsers.bind(this);
	}

	componentWillMount() {
		UsersActions.getEditors();
	}

	/**
	 * Checks if email is in available domain zone.
	 * Allowed only hosts selected in website profile
	 */
	private checkHost (email) {
		let isValid: boolean = false;
		const uHost = email.slice(email.indexOf('@') + 1);
		//for some reasons we allow 'www.' starting host names
		const domainRegExp = new RegExp(/^www\..*$/, 'i');
		this.props.hosts.forEach((host) => {
			const hostName = domainRegExp.test(host) ? host.slice(4) : host;
			if (hostName.toLowerCase() === uHost.toLowerCase()) {
				isValid = true;
			}
		});
		return isValid;
	}

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
			const chiefEditors = this.props.chiefEditors.asMutable();
			chiefEditors.splice(index, 1);
			return this.props.onChange({chiefEditors});
		}
	}

	onChange (e) {
		const userID = e.target.value;
		if (userID) {
			const newUser = this.props.users.find(user => user.ID === userID).without(['ID', 'date']);
			const chiefEditors = this.props.chiefEditors.asMutable();
			chiefEditors.push(newUser);
			e.target.value = '';
			return this.props.onChange({chiefEditors});
		}
	}

	render () {
		const chiefEditors = this.props.chiefEditors.map((item) => { item.name; });
		const users = this.getUsers();

		return (
			<div className="medium-12 columns">
				<fieldset className="text">
					<LabeledSelect
						onChange={this.onChange}
						label={<span>
								<b>Chief Editors</b><br/>
								Choose available editors here (roles "Editor" and "Site Admin")
							</span>
						}
						value=""
						ID={`chief-editor`}
						options={ users }
						enabled={ true }
						defaultOptionText={'-- select --'}
						name="parserClass"
					/>
					<TagList
						items={ chiefEditors }
						onDelete={this.onDelete}
						classes={`website-editors-list`}
					/>
				</fieldset>
			</div>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	return {
		chiefEditors: state.website.getIn(['selected', 'chiefEditors']),
		users: state.users.getIn(['users'], []),
		hosts: state.website.getIn(['selected', 'hosts']),
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(WebsiteEditors);
