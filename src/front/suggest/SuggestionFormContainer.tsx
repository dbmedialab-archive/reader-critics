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
import * as Recaptcha from 'react-recaptcha';

import { InputError } from 'front/form/InputError';
import { sendSuggestion } from 'front/apiCommunication';
import { FormattedMessage } from 'react-intl';
import Validation from 'base/Validation';
import { getLocale } from 'front/uiGlobals';
import {showSuccess} from 'front/uiHelpers';

const recaptchaLang = getLocale();

export interface FormPayload {
	email: string;
	comment: string;
	captcha: string | null;
	touched: {
		email: boolean,
		comment: boolean,
	};
}

export default class SuggestionFormContainer extends React.Component <any, FormPayload> {
	private commentArea : any;
	private emailInput : any;
	private readonly validator : Validation;
	private recaptchaInstance;

	constructor(props) {
		super(props);

		this.state = {
			email: '',
			comment: '',
			captcha: null,
			touched: {
				email: false,
				comment: false,
			},
		};

		this.validator = new Validation();

		this.handleSubmit = this.handleSubmit.bind(this);
		this.UpdateState = this.UpdateState.bind(this);
		this.handleBlur = this.handleBlur.bind(this);
		this.hasCommentError = this.hasCommentError.bind(this);
		this.verifyCaptcha = this.verifyCaptcha.bind(this);
	}

	private readonly handleBlur = (field) => (evt) => {
		this.setState({
			touched: { ...this.state.touched, [field]: true },
		});
	}

	private hasCommentError() {
		if (!this.state.comment) {
			return <FormattedMessage id="suggest.label.commentErr"/>;
		}

		const validation = this.validator.validate(
			'suggestionComment',
			this.state.comment,
			{ required: true }
		);

		return validation.isError ? validation.message : false;
	}

	private isFormValid() {
		return (
			!this.hasCommentError() && this.state.captcha
		);
	}

	// Helper class to update the components state when inputing values in text areas.
	private UpdateState(field : string, ref : any) {
		const state = {};
		state[ field ] = ref.value;
		this.setState( state );
	}

	private handleSubmit(e: any) {
		e.preventDefault();
		sendSuggestion(this.state)
		.then(() => {
			showSuccess(null, () => window.location.href = '/');
		})
		.catch((err) => {
			this.recaptchaInstance.reset();
		});
	}

	public render() : JSX.Element {
		return (
			<form
				name="suggestBox"
				className="twelve suggestion columns feedbackform"
				onSubmit={this.handleSubmit}
				action="javascript:alert(grecaptcha.getResponse(widgetId1));"
			>
				<fieldset>
					<p className="thank-message"><FormattedMessage id="suggest.ty"/></p>
				</fieldset>
				{ this.renderEmailInput() }
				{ this.renderCommentInput() }
				{ this.renderCaptcha() }
				{ this.renderButtons() }
			</form>
		);
	}

	private readonly renderEmailInput = () => (<fieldset className="text">
		<label htmlFor="email">Email</label>
		<input
			type="email"
			name="email"
			ref={r => this.emailInput = r}
			id="email"
			onBlur={this.handleBlur('email')}
			onChange={() => this.UpdateState('email', this.emailInput)}
		/>
	</fieldset>)

	private readonly renderCommentInput = () => <fieldset className="text">
		<label htmlFor="comment"><FormattedMessage id="suggest.label.comment"/></label>
		<textarea
			name="comment"
			onKeyUp={() => this.UpdateState('comment', this.commentArea)}
			ref={r => this.commentArea = r}
			rows={4}
			id="commentArea"
			onBlur={this.handleBlur('comment')}
		/>
		<InputError
			errorText={this.hasCommentError()}
			touchedField={this.state.touched['comment']}
		/>
	</fieldset>

	private readonly renderCaptcha = () => <fieldset>
		<Recaptcha
			ref={e => this.recaptchaInstance = e}
			sitekey={window['app']['recaptcha'] ? window['app']['recaptcha'].publicKey : ''}
			render="explicit"
			hl={recaptchaLang}
			verifyCallback={this.verifyCaptcha}
			onloadCallback={() => undefined}
		/>
	</fieldset>

	private verifyCaptcha(response) {
		this.setState({
			captcha: response,
		});
	}

	private readonly renderButtons = () => <fieldset className="actions">
		<button type="submit" disabled={!this.isFormValid()} className="button-primary">
			<FormattedMessage id="button.save"/>
		</button>
	</fieldset>

}
