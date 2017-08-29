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
import {InputError} from 'admin/components/form/InputError';
import {connect} from 'react-redux';

export const isHostName =
	(s: string): boolean => {
		const pattern = new RegExp(
			'^([w]{3,3}\\.)?[a-zA-Z0-9-]{1,61}[a-zA-Z0-9](\\.[a-zA-Z]{2,5})?\\.[a-zA-Z]{2,}$',
			'i');
		return pattern.test(s);
	};

class WebsiteHosts extends React.Component <any, any> {
	constructor (props) {
		super(props);

		this.state = {
			editMode: false,
			value: '',
			touched: false,
		};

		this.checkDuplicateLink = this.checkDuplicateLink.bind(this);
		this.onToggleEdit = this.onToggleEdit.bind(this);
		this.onDelete = this.onDelete.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.onKeyPress = this.onKeyPress.bind(this);
		this.onEdit = this.onEdit.bind(this);
		this.isEditing = this.isEditing.bind(this);
		this.checkExistingHosts = this.checkExistingHosts.bind(this);
	}

	// Function checks if the new host already exists in hosts array
	checkExistingHosts(existingHosts, addingHost) {
		let result = false;
		existingHosts.forEach((existLink) => {
			if (existLink.toLowerCase() === addingHost.toLowerCase()) {
				result = true;
			}
		});
		return result;
	}

	//Checks the adding link for duplicates
	checkDuplicateLink () {
		let result: string = '';
		const {value: link} = this.state;
		if (this.state.editMode) {
			if (link && isHostName(link)) {
				//check for duplicates in current site
				result = this.checkExistingHosts(this.props.hosts, link) ?
				'Duplicates are not allowed': result;
				//check for duplicates in all sites
				this.props.websites.forEach(wsite => {
					result = this.checkExistingHosts(wsite.hosts, link) ?
							'Duplicates with other sites are not allowed': result;
				});
			} else {
				result = 'URL is not valid';
			}
		}
		return result;
	}

	onToggleEdit () {
		return this.setState({
			editMode: !this.state.editMode,
			value: '',
			touched: false,
		});
	}

	onDelete (index) {
		if (index >= 0) {
			const hosts = this.props.hosts.asMutable();
			hosts.splice(index, 1);
			return this.props.onSubmit({hosts});
		}
	}

	onSubmit () {
		const {touched, value} = this.state;
		if (touched && value && !this.checkDuplicateLink()) {
			this.props.onSubmit({
				hosts: this.props.hosts.concat(value),
			});
			return this.setState({value: '', touched: false});
		}
	}

	onKeyPress (e) {
		if (e.key === 'Enter') {
			return this.onSubmit();
		}
	}

	onEdit (e) {
		this.setState({
			value: e.target.value,
			touched: true,
		});
	}

	isEditing() {
		return this.state.editMode || !this.props.ID;
	}

	render () {
		const hosts = this.props.hosts.map((host, index) => {
			return (<li key={index + '-host'} className="website-host-list">
				{host}
				{this.isEditing() ?
					<i className="fa fa-times" onClick={this.onDelete.bind(this, index)}/> : null}
			</li>);
		});
		return (
			<fieldset className="hosts">
				<label htmlFor="hosts-link">
					Hosts:
					{this.props.ID ?
					<a onClick={this.onToggleEdit} className="button default" href="#">
						{this.state.editMode ? 'Hide' : 'Edit'}
					</a>
					: null}
				</label>
				<ul>
					{hosts.length ?	hosts:
						(this.isEditing() ? null:
							(<li key={'0-host'} className="website-host-list">
								Hosts not set yet
							</li>)
					)}
				</ul>
				{this.isEditing() ? (<input
						id="hosts-link" type="text" className="small-12 large-4"
						value={this.state.value}
						onChange={this.onEdit}
						onKeyPress={this.onKeyPress} onBlur={this.onSubmit}
					/>
				) : null
				}
				{this.isEditing() ? <InputError
					errorText={this.checkDuplicateLink()}
					touchedField={this.state.touched}
				/> : null
				}
			</fieldset>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	return {
		hosts: state.website.getIn(['selected', 'hosts']) || [],
		ID: state.website.getIn(['selected', 'ID']) || null,
		websites: state.website.getIn(['websites']) || [],
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(WebsiteHosts);
