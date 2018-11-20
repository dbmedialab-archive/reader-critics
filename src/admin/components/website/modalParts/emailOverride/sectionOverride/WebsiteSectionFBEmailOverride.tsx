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
import WebsiteSectionEditors
	from 'admin/components/website/modalParts/emailOverride/sectionOverride/WebsiteSectionEditors';
import {SwitchBox} from 'admin/components/website/additionalComponents/SwitchBox';

import {
	WebsiteBaseEmailOverride
} from 'admin/components/website/modalParts/emailOverride/WebsiteBaseEmailOverride';

class WebsiteSectionFeedbackEmailOverride extends WebsiteBaseEmailOverride {

	constructor (props) {
		super(props);
		this.state = { checked : this.props.overrideSettings.settings.section };
		this.sendOverrideChanges = this.sendOverrideChanges.bind(this);
	}

	onToggleCheck = ((e) => {
		const { checked } = this.state;
		this.setState({ checked: !checked });
		return this.sendOverrideChanges(!checked);
	});

	getSectionEmailOverrides = (() => {
		const { sectionEditors } = this.props;
		const sectionEmails = [];
		sectionEditors.forEach((item)=> {
			const sectionEmailsObj = {};
			sectionEmailsObj[item.section] = item.editors.map((editor) => editor.email);
			sectionEmails.push(sectionEmailsObj);
		});
		return sectionEmails;
	});

	sendOverrideChanges (checked: boolean = false) {
		const { settings } = this.props.overrideSettings;
		const { overrides } = this.props.overrideSettings;
		const sectionEmailOverrides = this.getSectionEmailOverrides();

		const newSettings = Object.assign({}, settings, {section: checked});
		let newOverrides = {sectionFeedbackEmail : []};

		if (checked){
			newOverrides = Object.assign(
				{},
				overrides,
				{sectionFeedbackEmail : sectionEmailOverrides});
		}
		const overrideSettings = {overrides: newOverrides, settings: newSettings};
		return this.props.onChange({overrideSettings});
	}

	onTouch = ((touched:boolean = false) => {
		if (touched){
			const { checked } = this.state;
			this.sendOverrideChanges(checked);
		}
	});

	render () {
		const {checked} = this.state;
		return (
			<React.Fragment>
				<span className="small-12 medium-9 large-10 column" >
					<b>Feedback email override by category</b>
				</span>
				<WebsiteSectionEditors
					sectionEditors={this.props.sectionEditors}
					chiefEditors={this.props.chiefEditors}
					users={this.props.users}
					onChange={this.props.onChange} onTouch={this.onTouch}/>
				<div className="switcher-container medium-3 large-2 show-for-medium
												columns override-status-control">
					<SwitchBox
						classes={`switch round large`}	ID={'section-email-override-status'}
						checked={checked} onChange={this.onToggleCheck}
					/>
				</div>
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	return {
		overrideSettings: state.website.getIn(['selected', 'overrideSettings']),
		sectionEditors: state.website.getIn(['selected', 'sectionEditors']),
		chiefEditors: state.website.getIn(['selected', 'chiefEditors']),
		users: state.users.getIn(['users'], []),
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(WebsiteSectionFeedbackEmailOverride);
