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

class WebsiteEditors extends React.Component <any, any> {
	constructor (props) {
		super(props);

		this.state = {
			editMode: false,
		};

		this.onToggleEdit = this.onToggleEdit.bind(this);
		this.onDelete = this.onDelete.bind(this);
		this.onChange = this.onChange.bind(this);
		this.checkHost = this.checkHost.bind(this);
		this.getUsers = this.getUsers.bind(this);
		this.isEditing = this.isEditing.bind(this);
	}

	onToggleEdit () {
		return this.setState({editMode: !this.state.editMode});
	}

	onDelete (index) {
		const chiefEditors = this.props.chiefEditors.asMutable();
		chiefEditors.splice(index, 1);
		return this.props.onSubmit({chiefEditors});
	}

	onChange (e) {
		const userID = e.target.value;
		if (userID) {
			let newUser = null;
			this.props.users.forEach((user) => {
				if (user.ID === userID) {
					newUser = user.without(['ID', 'date']);
				}
			});
			const chiefEditors = (typeof this.props.chiefEditors.asMutable !== 'undefined') ?
									this.props.chiefEditors.asMutable() : this.props.chiefEditors;
			chiefEditors.push(newUser);
			e.target.value = '';
			return this.props.onSubmit({chiefEditors});
		}
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
			// Can add only users with allowed host names
			if (!this.checkHost(user.email)) {
				return false;
			}
			// We don't need duplicates
			for (const editor of this.props.chiefEditors) {
				if (editor.email === user.email) {
					return false;
				}
			}
			return true;
		}).map((user) => (
			<option key={user.ID} value={user.ID}>{user.name}</option>
		));
	}

	isEditing() {
		return this.state.editMode || !this.props.ID;
	}

	render () {
		const chiefs = this.props.chiefEditors.map((chief, index) => {
			return (<li key={index + 'editor'} className="website-editor-list">
				{chief.name}
				{this.isEditing() ?
				<i className="fa fa-times" onClick={this.onDelete.bind(this, index)}/> : null}
			</li>);
		});
		const users = this.getUsers();

		return (
			<fieldset className="chief-editors">
				<label htmlFor="chief-editor">
					Chief Editors:
					{this.props.ID ?
					<a onClick={this.onToggleEdit} className="button default" href="#">
						{this.state.editMode ? 'Hide' : 'Edit'}
					</a>
					: null}
				</label>
				<ul>
					{chiefs.length ? chiefs:
						(this.isEditing() ? null:
							(<li key={'0-editor'} className="website-editor-list">
								Chiefs not set yet
							</li>)
					)}
				</ul>
				{this.isEditing() ? (<select
					id="chief-editor" className="chief-editor small-12 large-4"
					onChange={this.onChange}
					value=""
				>
					<option value=""/>
					{users}
				</select>) : null
				}
			</fieldset>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	return {
		users: state.users.getIn(['users']) || [],
		chiefEditors: state.website.getIn(['selected', 'chiefEditors']) || [],
		hosts: state.website.getIn(['selected', 'hosts']) || [],
		ID: state.website.getIn(['selected', 'ID']) || null,
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(WebsiteEditors);
