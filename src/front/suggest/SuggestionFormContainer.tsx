import * as React from 'react';
import InputError from '../form/InputError';
import {sendSuggestion} from '../apiCommunication';

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
		if (this.state.comment.length > 2000) {
			return 'Tilbakemelding er for lang (maksimum 2000 tegn).';
		}
		return false;
	}

	private hasEmailError() {
		const emailPattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		const email = this.state.email;
		if (!emailPattern.test(email) || !email.length) {
			return 'Skriv inn gyldig e-postadresse.';
		}
		return false;
	}

	private isFormValid() {
		return (
			!this.hasCommentError() &&
			!this.hasEmailError()
		);
	}

	// Helper class to update the components state when inputing values in text areas.
	private UpdateState(field : string, ref : any) {
		const state = {};
		state[ field ] = ref.value;
		this.setState( state );
	}

	public handleSubmit(e : any) {
		e.preventDefault();
		console.log(this.state);
		sendSuggestion(this.state).then(function (res) {
			console.log(res);
		});
	}

	public render() : JSX.Element {
		const isDisabled = this.isFormValid();
		return (
			<form name='suggestBox' className='eleven suggestion columns feedbackform' onSubmit={this.handleSubmit}>
				<fieldset className='text'>
					<label htmlFor='comment'>Username</label>
					<input
						type='text'
						name='username'
						ref={r => this.usernameInput = r}
						id='username'
						onChange={() => this.UpdateState('username', this.usernameInput)}
					/>
				</fieldset>
				<fieldset className='text'>
					<label htmlFor='email'>Email</label>
					<input
						type='email'
						name='email'
						ref={r => this.emailInput = r}
						id='email'
						onBlur={this.handleBlur('email')}
						onChange={() => this.UpdateState('email', this.emailInput)}
					/>
					<InputError
						errorText={this.hasEmailError()}
						touchedField={this.state.touched['email']}
					/>
				</fieldset>
				<fieldset className='text'>
					<label htmlFor='comment'>Comment</label>
					<textarea
						name='comment'
						onKeyUp={() => this.UpdateState('comment', this.commentArea)}
						ref={r => this.commentArea = r}
						rows={3}
						id='commentArea'
						onBlur={this.handleBlur('comment')}
					/>
					<InputError
						errorText={this.hasCommentError()}
						touchedField={this.state.touched['comment']}
					/>
				</fieldset>
				<fieldset className='actions'>
					<button type='submit' disabled={!isDisabled} className='button button-primary'>Lagre</button>
				</fieldset>
			</form>
		);
	}

}
