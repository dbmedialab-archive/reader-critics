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
			userIndex: -1,
		};

		this.onToggleEdit = this.onToggleEdit.bind(this);
		this.onDelete = this.onDelete.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.onChange = this.onChange.bind(this);
		this.checkHost = this.checkHost.bind(this);
	}

	onToggleEdit () {
		return this.setState({editMode: !this.state.editMode});
	}

	onDelete () {
		console.log('delete');
		return;
	}

	onChange (e) {
		return this.setState({userIndex: [e.target.value]});
	}

	onSubmit () {
		if (~this.state.userIndex) {
			const newUser = this.props.users[this.state.userIndex];
			const chiefEditors = this.props.chiefEditors.asMutable();
			chiefEditors.concat(newUser);
			return this.props.onSubmit({chiefEditors});
		}
	}

	/**
	 * Checks if email is in available domain zone.
	 * Allowed only hosts selected in website profile
	 */
	private checkHost (email) {
		let isValid: boolean = false;
		const uHost = email.slice(0, email.indexOf('@'));
		const domainRegExp = new RegExp(/^www\..*$/, 'i');
		this.props.hosts.forEach((host) => {
			const hostName = domainRegExp.test(host) ? host.slice(4) : host;
			if (hostName.toLowerCase() === uHost.toLowerCase()) {
				isValid = true;
			}
		});
		return isValid;
	}

	render () {
		const chiefs = this.props.chiefEditors.map((chief, index) => {
			return (<li key={index + 'editor'} className="website-editor-list">
				{chief.name}
				{this.state.editMode ? <i className="fa fa-times" onClick={this.onDelete}/> : null}
			</li>);
		});
		const users = this.props.users
				.map((user, index) => {
					// Setting indexes of current users array to
					// find user on Add and pass to data
					user.index = index;
					return user;
				}).filter((user) => {
					// Can add only users with allowed host names
					if (!this.checkHost(user.email)) {
						return false;
					}
					// We don't need duplicates
					this.props.chiefEditors.forEach((editor) => {
						if (editor.email === user.email) {
							return false;
						}
					});
					return true;
				}).map((user) => (
					<option value={user.index}>{user.name}</option>
				));
		return (
			<fieldset className="chief-editors">
				<label htmlFor="chief-editor">
					Chief Editors:
					<a onClick={this.onToggleEdit} className="button default" href="#">
						{this.state.editMode ? 'Hide' : 'Edit'}
					</a>
				</label>
				<ul>
					{chiefs}
				</ul>
				{this.state.editMode ? (<select
					id="chief-editor" className="chief-editor small-12 large-4"
					onChange={this.onChange} onBlur={this.onSubmit}
					value={this.state.userIndex}
				>
					<option value="-1"/>
					{users}
				</select>) : null
				}
			</fieldset>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	return {
		users: state.users || [],
		chiefEditors: state.website.getIn(['selected', 'chiefEditors']) || [],
		hosts: state.website.getIn(['selected', 'hosts']) || [],
		website: state.website.getIn(['selected']) || {},
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(WebsiteEditors);
