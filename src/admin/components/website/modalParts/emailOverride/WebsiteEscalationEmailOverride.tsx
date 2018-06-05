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
import {WebsiteOverrideSettings} from './WebsiteOverrideSettings';
import {WebsiteBaseEmailOverride} from './WebsiteBaseEmailOverride';

class WebsiteEscalationEmailOverride extends WebsiteBaseEmailOverride {

	constructor (props) {
		super(props);
		this.state = {
			value: '',
			touched: false,
		};

		this.onChange = this.onChange.bind(this);
		this.sendOverrideChanges = this.sendOverrideChanges.bind(this);
	}

	render () {
		const {settings: {escalation: escalationStatus = false}, escalationEmailOverride} = this.props;
		const {value, touched} = this.state;
		return (
			<WebsiteOverrideSettings
				list={escalationEmailOverride}
				listPropName={'escalationEmail'}
				isControllable={true}
				controlPropName={'escalation'}
				controlPropValue={escalationStatus}
				label={<span>
					<b>Escalation email override</b><br/>
					Emails to send notifications about escalation (instead of website chief editors)
				</span>}
				ID={'escalation-email-override-status'}
				value={value}
				touched={touched}
				onSubmit={this.sendOverrideChanges}
				onChange={this.onChange}
			/>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	return {
		escalationEmailOverride: state.website.getIn(
			['selected', 'overrideSettings', 'overrides', 'escalationEmail'], []),
		overrideSettings: state.website.getIn(
			['selected', 'overrideSettings'], {}),
		settings: state.website.getIn(
			['selected', 'overrideSettings', 'settings'], {}),
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(WebsiteEscalationEmailOverride);
