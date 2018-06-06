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
import { LabeledInput } from 'admin/components/website/additionalComponents/LabeledInput';
import { TagList } from 'admin/components/website/additionalComponents/TagList';
import { connect } from 'react-redux';
import Validator from 'admin/services/Validation';

class WebsiteHosts extends React.Component <any, any> {
	private readonly validator : Validator;

	private allHosts : string[] = [];

	constructor (props) {
		super(props);
		this.state = {
			value: '',
			touched: false,
		};

		this.validator = new Validator();

		this.onDelete = this.onDelete.bind(this);
		this.checkExistingHosts = this.checkExistingHosts.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.onEdit = this.onEdit.bind(this);

		this.props.websites.forEach(ws => {
			if (ws.ID !== this.props.ID) {
				this.allHosts = this.allHosts.concat(ws.hosts);
			}
		});
	}

	// Checks the added link for duplicates

	checkExistingHosts (): string {
		const { value: link } = this.state;
		const { hosts } = this.props;

		const isHost = this.validator.validate('host', link, { required: true });

		if (isHost.isError) {
			return isHost.message;
		}
		else {
			const isUniqueHere = this.validator.validate('uniqueness', hosts.concat(link));

			if (isUniqueHere.isError) {
				return isUniqueHere.message;
			}

			const reallyAllHosts = this.allHosts.concat(link);
			const isUniqueGlobally = this.validator.validate('uniqueness', reallyAllHosts);

			if (isUniqueGlobally.isError) {
				return 'This hostname is already in use';
			}

			return '';
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
		if (touched && value && !this.checkExistingHosts()) {
			const hosts = this.props.hosts.concat(value);
			this.props.onChange({hosts});
			return this.setState({value: '', touched: false});
		}
	}

	onEdit (e) {
		this.setState({
			value: e.target.value,
			touched: true,
		});
	}

	render () {
		const { value, touched } = this.state;
		return (
			<div className="medium-12 columns">
				<fieldset className="text">
					<LabeledInput
						onSubmit={this.onSubmit} errorText={this.checkExistingHosts()}
						onEdit={this.onEdit} value={value} touched={touched}
						label={<span>
								<b>Hosts</b><br/>
								All hostnames that this site uses to publish articles, including "www" variants
							</span>}
						ID={`hosts-link`}
					/>
					<TagList
						items={this.props.hosts}
						onDelete={this.onDelete}
						classes="website-settings-list"
						color="blue"
					/>
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
