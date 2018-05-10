// //
// // LESERKRITIKK v2 (aka Reader Critics)
// // Copyright (C) 2017 DB Medialab/Aller Media AS, Oslo, Norway
// // https://github.com/dbmedialab/reader-critics/
// //
// // This program is free software: you can redistribute it and/or modify it under
// // the terms of the GNU General Public License as published by the Free Software
// // Foundation, either version 3 of the License, or (at your option) any later
// // version.
// //
// // This program is distributed in the hope that it will be useful, but WITHOUT
// // ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
// // FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
// //
// // You should have received a copy of the GNU General Public License along with
// // this program. If not, see <http://www.gnu.org/licenses/>.
// //
//
// import * as React from 'react';
// import WebsiteLayoutContentSection from
// 	'admin/components/website/modalParts/WebsiteLayoutContentSection';
//
// export interface IWSOverrideSettingsProps {
// 	overrideSettings?: {
// 		settings?: {
// 			escalation : boolean,
// 			feedback : boolean,
// 		},
// 		overrides?: {
// 			feedbackEmail?: string[],
// 			fallbackFeedbackEmail?: string[],
// 			escalationEmail?: string[],
// 		},
// 	},
// 	onSubmit: (object: object) => void;
// }
//
// export enum overrideLists {
// 	feedbackEmail = 'feedbackEmail',
// 	fallbackFeedbackEmail = 'fallbackFeedbackEmail',
// 	escalationEmail = 'escalationEmail',
// }
//
// class WebsiteOverrideSettings extends React.Component
// 	<IWSOverrideSettingsProps, any> {
// 	constructor (props: IWSOverrideSettingsProps) {
// 		super(props);
// 		this.state = {
// 			visible: false,
// 		};
//
// 		this.onChange = this.onChange.bind(this);
// 	}
//
// 	onSubmit () {
// 		const {overrideSettings} = this.props;
// 		return this.props.onSubmit({overrideSettings});
// 	}
//
// 	toggleVisibility () {
// 		this.setState({visible: !this.state.visible});
// 	}
//
// 	render () {
// 		const {visible} = this.state;
// 		const {overrideSettings} = this.props;
// 		return (
// 			<div className={`row override-settings-section${visible ? ' opened' : ''}`}>
// 				<div className="small-12 columns">
// 					<div className="override-btn" onClick={this.toggleVisibility}>
// 						Override Settings
// 					</div>
// 				</div>
// 				<div className="small-12 columns override-settings-content">
// 					<WebsiteLayoutContentSection
// 						buttonText={'Feedback page template'}
// 						templateName={'feedbackPage'}
// 						onSubmit={this.onSubmit}
// 						value={feedbackPage}
// 						onChange={this.onChange.bind(this,'feedbackPage')}/>
// 					<WebsiteLayoutContentSection
// 						value={feedbackNotificationMail}
// 						buttonText={'Feedback notification mail template'}
// 						templateName={'feedbackNotificationMail'}
// 						onSubmit={this.onSubmit}
// 						onChange={this.onChange.bind(this,'feedbackNotificationMail')}/>
// 				</div>
// 			</div>
// 		);
// 	}
// }
