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
import ReactModal from './ReactModalComponent';
import * as UIActions from 'admin/actions/UIActions';
import * as WebsiteActions from 'admin/actions/WebsiteActions';
import WebsiteParserClass from 'admin/components/website/modalParts/WebsiteParserClass';
import WebsiteName from 'admin/components/website/modalParts/WebsiteName';
import WebsiteHosts from 'admin/components/website/modalParts/WebsiteHosts';
import WebsiteEditors from 'admin/components/website/modalParts/WebsiteEditors';
import WebsiteSectionFeedbackEmailOverride from
		'admin/components/website/modalParts/emailOverride/sectionEmailOverride/WebsiteSectionFBEmailOverride';
import WebsiteSectionEditors from
		'admin/components/website/modalParts/emailOverride/sectionEmailOverride/WebsiteSectionEditors';
import WebsiteLayout from 'admin/components/website/modalParts/WebsiteLayout';
import {WebsiteLayoutProps} from 'admin/types/Website';
import WebsiteFeedbackEmailOverride from
'admin/components/website/modalParts/emailOverride/WebsiteFeedbackEmailOverride';
import WebsiteEscalationEmailOverride from
'admin/components/website/modalParts/emailOverride/WebsiteEscalationEmailOverride';
import WebsiteFallbackFeedbackEmail from
'admin/components/website/modalParts/emailOverride/WebsiteFallbackFeedbackEmail';

export interface IWebsiteUpdateProps {
	currentName: string;
	name?: string;
	parserClass?: string;
	hosts?: string[];
	chiefEditors?: {name: string, email: string}[];
	sectionEditors?: {name: string, email: string, section: string}[];
	layout?: WebsiteLayoutProps;
}

class WebsiteModalComponent extends React.Component <any, any> {
	constructor (props) {
		super(props);

		this.closePopup = this.closePopup.bind(this);
		this.closeReset = this.closeReset.bind(this);
		this.onUpdate = this.onUpdate.bind(this);
		this.onNewWebsiteSave = this.onNewWebsiteSave.bind(this);
	}

	componentWillMount () {
		UIActions.initModalWindows(this.props.windowName);
	}

	componentWillUnmount () {
		WebsiteActions.setSelectedWebsite(null);
	}

	closePopup (): void {
		if (this.props.ID) {
			UIActions.closeReset(this.props.windowName);
		} else {
			UIActions.modalWindowsChangeState(this.props.windowName, {isOpen: false});
		}
	}

	closeReset (): void {
		UIActions.closeReset(this.props.windowName);
	}

	onUpdate (data: object): void {
		if (this.props.ID) {
			const dataToSend:IWebsiteUpdateProps = Object.assign({currentName: this.props.name}, data);
			console.log('data to send', dataToSend);
			return WebsiteActions.updateWebsite(dataToSend);
		} else {
			return WebsiteActions.updateNewWebsiteTemplate(data);
		}
	}

	onNewWebsiteSave () {
		if (!this.props.ID && this.props.name) {
			WebsiteActions.createWebsite(this.props.currentWebsite);
			return this.closeReset();
		}
	}

	render (): JSX.Element {
		const {isOpen, name, ID, feedbackPage, feedbackNotificationMail} = this.props;
		const isDisabled = name && !ID;

		const captionAdd = (<div className="caption" key="add-website"><b>Add New Website</b></div>);
		const captionEdit = [
			<div className="caption" key="edit-website"><b>Edit Website</b></div>,
			<div className="hint" key="hint">Changes made here are saved immediately</div>,
		];

		return (
			<ReactModal isOpen={isOpen} name="website" closeHandler={this.closePopup}>
				<div className="modal-window">
					<div className="close-btn">
						<i onClick={this.closeReset} className="fa fa-close"/>
					</div>
					<div className="row">
						<div className="medium-12 columns modal-caption">
							{ ID ? captionEdit : captionAdd }
						</div>
					</div>
					<form className="website-edit-form">
						<div className="row">
							<WebsiteName onSubmit={this.onUpdate} name={name} />
							<WebsiteParserClass	onChange={this.onUpdate} />
						</div>
						<div className="row">
							<WebsiteHosts onChange={this.onUpdate}	/>
						</div>
						<div className="row">
							<WebsiteEditors	onChange={this.onUpdate} />
						</div>
						<div className="row">
							<WebsiteSectionFeedbackEmailOverride onChange={this.onUpdate} />
						</div>
						<div className="row">
							<WebsiteFeedbackEmailOverride onChange={this.onUpdate} />
						</div>
						<div className="row">
							<WebsiteEscalationEmailOverride onChange={this.onUpdate} />
						</div>
						<div className="row">
							<WebsiteFallbackFeedbackEmail onChange={this.onUpdate} />
						</div>
						<WebsiteLayout
							feedbackPage={feedbackPage}
							feedbackNotificationMail={feedbackNotificationMail}
							onSubmit={this.onUpdate}
						/>
						{!ID ?
						<div className="row button-holder">
							<div className="medium-12 columns">
								<button type="button"
										disabled={!isDisabled}
										onClick={this.onNewWebsiteSave}
										className="button">Save
								</button>
								<button type="button"
										onClick={this.closeReset}
										className="secondary button cancel-button">Cancel
								</button>
							</div>
						</div> : null}
					</form>
				</div>
			</ReactModal>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	return {
		isOpen: state.UI.getIn(['modalWindows', ownProps.windowName, 'isOpen'], false),
		feedbackPage: state.website.getIn(['selected', 'layout', 'templates', 'feedbackPage'], ''),
		feedbackNotificationMail: state.website.getIn(['selected', 'layout', 'templates',
										'feedbackNotificationMail'], ''),
		ID: state.website.getIn(['selected', 'ID'], null),
		name: state.website.getIn(['selected', 'name'], ''),
		currentWebsite: state.website.getIn(['selected']),
	};
};

const mapDispatchToProps = () => {
	return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(WebsiteModalComponent);
