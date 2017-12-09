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
import WebsiteLayoutContentSection from
	'admin/components/website/modalParts/WebsiteLayoutContentSection';

export interface IWebsiteLayoutProps {
	feedbackPage?: string;
	feedbackNotificationMail?: string;
	onSubmit: (object: object) => void;
}

export enum templates {
	feedbackPage= 'feedbackPage',
	feedbackNotificationMail = 'feedbackNotificationMail',
}

export default class WebsiteLayout extends React.Component <IWebsiteLayoutProps, any> {
	constructor (props: IWebsiteLayoutProps) {
		super(props);
		this.state = {
			visible: false,
			feedbackPage: this.props.feedbackPage,
			feedbackNotificationMail: this.props.feedbackNotificationMail,
		};

		this.onSubmit = this.onSubmit.bind(this);
		this.toggleVisibility = this.toggleVisibility.bind(this);
		this.onChange = this.onChange.bind(this);
	}

	componentWillReceiveProps (nextProps) {
		this.setState({
			feedbackPage: nextProps.feedbackPage,
			feedbackNotificationMail: nextProps.feedbackNotificationMail,
		});
	}

	onChange(templateName: templates, value: string) {
		console.log(templateName, value);
		this.setState({[templateName]: value});
	}

	onSubmit () {
		const {feedbackPage, feedbackNotificationMail} = this.state;
		const {
			feedbackPage: oldFeedbackPage,
			feedbackNotificationMail: oldFeedbackNotificationMail,
		} = this.props;
		if (feedbackPage !== oldFeedbackPage ||
			feedbackNotificationMail !== oldFeedbackNotificationMail) {
			return this.props.onSubmit(
				{
					layout: {
						templates: {
							feedbackPage,
							feedbackNotificationMail,
						},
					},
				}
			);
		}
	}

	toggleVisibility () {
		this.setState({visible: !this.state.visible});
	}

	render () {
		const {visible, feedbackPage, feedbackNotificationMail} = this.state;
		return (
			<div className={`row layout-settings-section${visible ? ' opened' : ''}`}>
				<div className="small-12 columns">
					<div className="layout-btn" onClick={this.toggleVisibility}>
						Layout Settings
					</div>
				</div>
				<div className="small-12 columns layout-content">
					<WebsiteLayoutContentSection
						buttonText={'Feedback page template'}
						templateName={'feedbackPage'}
						onSubmit={this.onSubmit}
						value={feedbackPage}
						onChange={this.onChange.bind(this,'feedbackPage')}/>
					<WebsiteLayoutContentSection
						value={feedbackNotificationMail}
						buttonText={'Feedback notification mail template'}
						templateName={'feedbackNotificationMail'}
						onSubmit={this.onSubmit}
						onChange={this.onChange.bind(this,'feedbackNotificationMail')}/>
				</div>
			</div>
		);
	}
}
