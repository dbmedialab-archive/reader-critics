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

import { connect } from 'react-redux';

class WebsiteEditors extends React.Component <any, any> {
	constructor (props) {
		super(props);
		this.onDelete = this.onDelete.bind(this);
		this.checkHost = this.checkHost.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
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
				<option key={user.ID} value={user.ID}>{user.name}</option>
			));
	}

	onDelete (index) {
		if (index >= 0) {
			const chiefEditors = this.props.chiefEditors.asMutable();
			chiefEditors.splice(index, 1);
			return this.props.onChange({chiefEditors});
		}
	}

	onSubmit (e) {
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
		const chiefs = this.props.chiefEditors.map((chief, index) => {
			return (<li key={index + 'editor'} className="website-editors-list-item">
				{chief.name}
				<i className="fa fa-times" onClick={this.onDelete.bind(this, index)}/>
			</li>);
		});

		const users = this.getUsers();

		return (
			<div className="medium-12 columns">
				<fieldset className="text">
					<label htmlFor="chiefs">
						<b>Chief Editors</b><br/>
						Choose available editors here (roles "Editor" and "Site Admin")
					</label>
					<select
						id="chief-editor" className="chief-editor small-12"
						onChange={this.onSubmit}
						value=""
					>
						<option value="">-- select --</option>
						{users}
					</select>
					<ul className="website-editors-list">
						{chiefs}
					</ul>
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
