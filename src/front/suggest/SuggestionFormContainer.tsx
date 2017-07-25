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
import { InputError } from 'front/form/InputError';
import { sendSuggestion } from 'front/apiCommunication';
import Validator, {IValidation} from 'base/Validation';

export interface FormPayload {
	username: string;
	email: string;
	comment: string;
	touched: {
		email: boolean,
		comment: boolean,
	};
}

export default class SuggestionFormContainer extends React.Component <any, FormPayload> {
	private usernameInput : any;
	private commentArea : any;
	private emailInput : any;
	private validator : IValidation;

	constructor(props) {
		super(props);

		this.state = {
			username: '',
			email: '',
			comment: '',
			touched: {
				email: false,
				comment: false,
			},
		};

		this.validator = new Validator();

		this.handleSubmit = this.handleSubmit.bind(this);
		this.UpdateState = this.UpdateState.bind(this);
		this.handleBlur = this.handleBlur.bind(this);
		this.hasCommentError = this.hasCommentError.bind(this);
		this.hasEmailError = this.hasEmailError.bind(this);
	}

	private handleBlur = (field) => (evt) => {
		this.setState({
			touched: { ...this.state.touched, [field]: true },
		});
	}

	private hasCommentError() {
		if (!this.state.comment) {
			return 'Fylle ut feltet';
		}

		const validation = this.validator.validate('suggestionComment',
			this.state.comment, {presence: 'required'});
		if (validation.isError) {
			return validation.message;
		}
		return false;
	}

	private isFormValid() {
		return (
			!this.hasCommentError()
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
		sendSuggestion(this.state).then(function (res: any) {
			console.log(res);
		});
	}

	public render() : JSX.Element {
		const isDisabled = this.isFormValid();
		return (
			<form
				name="suggestBox"
				className="eleven suggestion columns feedbackform"
				onSubmit={this.handleSubmit}
			>
				<fieldset className="text">
					<label htmlFor="comment">Username</label>
					<input
						type="text"
						name="username"
						ref={r => this.usernameInput = r}
						id="username"
						onChange={() => this.UpdateState('username', this.usernameInput)}
					/>
				</fieldset>
				<fieldset className="text">
					<label htmlFor="email">Email</label>
					<input
						type="email"
						name="email"
						ref={r => this.emailInput = r}
						id="email"
						onBlur={this.handleBlur('email')}
						onChange={() => this.UpdateState('email', this.emailInput)}
					/>
					<InputError
						errorText={this.hasEmailError()}
						touchedField={this.state.touched['email']}
					/>
				</fieldset>
				<fieldset className="text">
					<label htmlFor="comment">Comment</label>
					<textarea
						name="comment"
						onKeyUp={() => this.UpdateState('comment', this.commentArea)}
						ref={r => this.commentArea = r}
						rows={3}
						id="commentArea"
						onBlur={this.handleBlur('comment')}
					/>
					<InputError
						errorText={this.hasCommentError()}
						touchedField={this.state.touched['comment']}
					/>
				</fieldset>
				<fieldset className="actions">
					<button type="submit" disabled={!isDisabled} className="button button-primary">Lagre</button>
				</fieldset>
			</form>
		);
	}
}
