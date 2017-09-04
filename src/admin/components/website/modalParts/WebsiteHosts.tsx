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
import Validator from 'admin/services/Validation';

class WebsiteHosts extends React.Component <any, any> {
	private validator: Validator;

	constructor (props) {
		super(props);
		this.state = {
			value: '',
			touched: false,
		};

		this.validator = new Validator();

		this.onDelete = this.onDelete.bind(this);
		this.checkExistingHosts = this.checkExistingHosts.bind(this);
		this.checkDuplicateLink = this.checkDuplicateLink.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.onKeyPress = this.onKeyPress.bind(this);
		this.onEdit = this.onEdit.bind(this);
	}

	// Function checks if the new host already exists in hosts array
	checkExistingHosts (existingHosts, addingHost) {
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
		const {value: link} = this.state;
		const {hosts, websites, ID} = this.props;

		let allHosts = websites.asMutable();
		allHosts = allHosts
			// We need all sites except current
			.filter(website => {
				return website.ID !== ID;
			})

			// need only list of hosts of all websites
			.reduce((res, website) => {
				return res.concat(website.hosts);
			}, [])

			// We CAN have hosts with 'www'. But we have to check
			// only for duplicate domains. 'www' have to not be there
			// for this check
			.map(host => !host.indexOf('www.') ? host.slice(4) : host);

		// Link we also check without 'www'
		allHosts.push(!link.indexOf('www.') ? link.slice(4) : link);

		const isHost = this.validator.validate('host', link, {required: true});

		if (isHost.isError) {
			return isHost.message;
		} else {
			const isUniqueHere = this.validator.validate('uniqueness', hosts);
			const isUniqueGlobally = this.validator.validate('uniqueness', allHosts);
			if (isUniqueHere.isError) {
				return isUniqueHere.message;
			}
			if (isUniqueGlobally.isError) {
				return isUniqueGlobally.message;
			}
			return false;
		}
	}

	onDelete (index) {
		if (index >= 0) {
			const hosts = this.props.hosts.asMutable();
			hosts.splice(index, 1);
			return this.props.onChange({hosts});
		}
	}

	onSubmit () {
		const {touched, value} = this.state;
		if (touched && value && !this.checkDuplicateLink()) {
			const hosts = this.props.hosts.concat(value);
			this.props.onChange({hosts});
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

	render () {
		const hosts = this.props.hosts.map((host, index) => {
			return (<li key={index + '-host'} className="website-hosts-list-item">
				{host}
				<i className="fa fa-times" onClick={this.onDelete.bind(this, index)}/>
			</li>);
		});
		return (
			<div className="medium-12 columns">
				<fieldset className="text">
					<label htmlFor="hosts-link">Hosts</label>
					<input
						id="hosts-link" type="text" className="small-12 medium-12"
						value={this.state.value}
						onChange={this.onEdit}
						onKeyPress={this.onKeyPress} onBlur={this.onSubmit}
					/>
					<InputError
						errorText={this.checkDuplicateLink()}
						touchedField={this.state.touched}
					/>
					<ul className="website-hosts-list">
						{hosts}
					</ul>
				</fieldset>
			</div>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	return {
		hosts: state.website.getIn(['selected', 'hosts']),
		websites: state.website.getIn(['websites'], []),
		ID: state.website.getIn(['selected', 'ID'], null),
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(WebsiteHosts);
