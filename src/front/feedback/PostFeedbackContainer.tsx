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

// tslint:disable max-file-line-count

import * as React from 'react';

import EndUser from 'base/EndUser';
import Transition from 'react-transition-group/Transition';

import { FormattedMessage } from 'react-intl';
import { getArticleURL } from 'front/uiGlobals';
import { sendEnduserData } from 'front/apiCommunication';

export interface EndUserFormProps {
	updateToken : string
}

export interface FeedbackUserState {
	isSend: boolean;
	user: EndUser;
	nameField: {
		show: boolean,
	},
	emailField: {
		show: boolean,
	},
	sendBtn: {
		show: boolean,
	},
	backBtn: {
		show: boolean,
	},
	mailIcon: {
		show: boolean,
	},
	doneIcon: {
		show: boolean,
	},
	finalText: {
		show: boolean,
	},
}

export default class PostFeedbackContainer
extends React.Component <EndUserFormProps, FeedbackUserState>
{

	constructor() {
		super();
		this.state = {
			isSend: false,
			user : {
					name: null,
					email: null,
			},
			nameField: {
				show: true,
			},
			emailField: {
				show: true,
			},
			sendBtn: {
				show: true,
			},
			backBtn: {
				show: false,
			},
			mailIcon: {
				show: true,
			},
			doneIcon: {
				show: false,
			},
			finalText: {
				show: false,
			},
		};
		this._handleSubmit = this._handleSubmit.bind(this);
		this._inputChanged = this._inputChanged.bind(this);
		this.hideComponent = this.hideComponent.bind(this);
		this.showComponent = this.showComponent.bind(this);
		this.afterSendingAnimation = this.afterSendingAnimation.bind(this);
		this.postEnduserData = this.postEnduserData.bind(this);
		this.onUnload = this.onUnload.bind(this);
	}

	componentDidMount() {
		window.addEventListener('beforeunload', this.onUnload, false);
	}

	componentWillUnmount() {
		window.removeEventListener('beforeunload', this.onUnload);
	}

	private afterSendingAnimation() {
		this.hideComponent('nameField');
		this.hideComponent('mailIcon');
		this.showComponent('doneIcon', 200);
		this.hideComponent('emailField',50);
		this.hideComponent('sendBtn', 100);
		this.showComponent('backBtn', 400);
		this.showComponent('finalText', 400);
	}

	onUnload(event) {
		if (!this.state.isSend) {
			event.preventDefault();
			const dialogText = 'Thank you for your feedback';
			(event || window.event).returnValue = dialogText; //Gecko + IE
			return dialogText;
		}
		return false;
	}

	private hideComponent(param, timeout = 0) {
		const stateObj = {};
		stateObj[param] = {
			show: false,
		};
		if (timeout) {
			setTimeout(()=>{
				this.setState(stateObj);
			},timeout);
		} else {
			this.setState(stateObj);
		}
	}

	private showComponent(param, timeout = 0) {
		const stateObj = {};
		stateObj[param] = {
			show: true,
		};
		if (timeout) {
			setTimeout(()=>{
				this.setState(stateObj);
			},timeout);
		} else {
			this.setState(stateObj);
		}
	}

	private _handleSubmit(e) {
		e.preventDefault();
		this.postEnduserData();
	}

	private _inputChanged(e) {
		const fieldName = e.target.name;
		const userObj = this.state.user;
		userObj[fieldName] = e.target.value;
		this.setState({user:userObj});
	}

	private postEnduserData() {
		return sendEnduserData(Object.assign({
			updateToken: this.props.updateToken,
		}, this.state.user))
		.then((response) => {
			this.setState({
				isSend: true,
			}, this.afterSendingAnimation);
		});
	}

	public render() {
		return (
			<form id="postFeedbackBox" className="twelve columns feedbackform">
				{ this.renderMailIcon() }
				<fieldset>
					<p className="field-title"><FormattedMessage id="message.thankYou"/></p>
					<p className="message"><FormattedMessage id="message.postFeedback"/></p>
				</fieldset>
				<Transition timeout={300} in={this.state.finalText.show}>
					{(status) => (
						<div>
							<fieldset className={`final-text fade fade-${status}`}>
								<p className="field-title"><FormattedMessage id="fb.post.transmitted"/></p>
							</fieldset>
						</div>
					)}
				</Transition>
				<Transition timeout={300} in={this.state.nameField.show}>
					{(status) => (
						<fieldset className={`slide-left slide-left-${status}`}>
							<p className="field-title"><FormattedMessage id="fb.label.name"/></p>
							<input
								type="text"
								name="name"
								onChange={this._inputChanged}
							/>
					</fieldset>
					)}
				</Transition>
				<Transition timeout={250} in={this.state.emailField.show}>
					{(status) => (
						<fieldset className={`slide-left slide-left-${status}`}>
							<p className="field-title"><FormattedMessage id="fb.label.getRecommend"/></p>
							<input
								type="text"
								name="email"
								onChange={this._inputChanged}
							/>
						</fieldset>
					)}
				</Transition>
				{ this.renderBottomLinks() }
			</form>
		);
	}

	private readonly renderMailIcon = () => (
		<Transition timeout={200} in={this.state.mailIcon.show || this.state.doneIcon.show}>
			{(status) => (
				<fieldset className={`info-icon rotate hideit-after rotate-${status}`}>
						{ this.state.doneIcon.show
							? <span className="top icon done"/>
							: <span className="top icon question"/>
						}
				</fieldset>
			)}
		</Transition>
	)

	private readonly renderBottomLinks = () => (
		<fieldset
			id="bottomLinks"
			className={`control-icon hideit-after slide-left slide-left-${status}`}
		>
			<div id="submitForm">
				<a href="#" role="button" onClick={this._handleSubmit}>
					<span className="icon mail"/>
					<span className="btn-text"><FormattedMessage id="fb.label.keepInfo"/></span>
				</a>
			</div>
			<div id="backToArticle">
				<a href={getArticleURL()}>
					<span className="icon back"/>
					<span className="btn-text"><FormattedMessage id="fb.label.backToArticle"/></span>
				</a>
			</div>
		</fieldset>
	)
}
