import * as React from 'react';
import { InputError } from 'front/form/InputError';
import { sendAuthRequest } from 'admin/apiAdminCommunication';

export interface AuthFormPayload {
	login: string;
	password: string;
	touched: {
		login: boolean,
		password: boolean,
	};
}

export default class LoginFormContainer extends React.Component <any, AuthFormPayload> {
	private passwordInput : any;
	private loginInput : any;

	constructor(props) {
		super(props);

		this.state = {
			login: '',
			password: '',
			touched: {
				login: false,
				password: false,
			},
		};

		this.UpdateState = this.UpdateState.bind(this);
		this.handleBlur = this.handleBlur.bind(this);
		this.hasPasswordError = this.hasPasswordError.bind(this);
		this.hasLoginError = this.hasLoginError.bind(this);
	}

	private handleBlur = (field) => (evt) => {
		this.setState({
			touched: { ...this.state.touched, [field]: true },
		});
	}

	private hasPasswordError() {
		if (!this.state.password) {
			return 'Fylle ut feltet';
		}
		if (this.state.password.length > 16) {
			return 'Passordet er for langt (maksimum 16 tegn).';
		}
		return false;
	}

	private hasLoginError() {
		if (!this.state.login) {
			return 'Fylle ut feltet';
		}
		if (this.state.login.length > 16) {
			return 'Brukernavn er for lang (maksimum 16 tegn).';
		}
		return false;
	}

	private isFormValid() {
		return (
			!this.hasPasswordError() &&
			!this.hasLoginError()
		);
	}

	// Helper class to update the components state when inputing values in text areas.
	private UpdateState(field : string, ref : any) {
		const state = {};
		state[ field ] = ref.value;
		this.setState( state );
	}

	public render() : JSX.Element {
		const isDisabled = this.isFormValid();
		return (
			<form name='authBox' className='eleven login columns feedbackform' method='post' action='login'>
				<fieldset className='text'>
					<label htmlFor='login'>Login</label>
					<input
						type='text'
						name='login'
						ref={r => this.loginInput = r}
						id='login'
						onBlur={this.handleBlur('login')}
						onChange={() => this.UpdateState('login', this.loginInput)}
					/>
					<InputError
						errorText={this.hasLoginError()}
						touchedField={this.state.touched['login']}
					/>
				</fieldset>
				<fieldset className='text'>
					<label htmlFor='password'>Password</label>
					<input
						type='text'
						name='password'
						ref={r => this.passwordInput = r}
						id='password'
						onBlur={this.handleBlur('password')}
						onChange={() => this.UpdateState('password', this.passwordInput)}
					/>
					<InputError
						errorText={this.hasPasswordError()}
						touchedField={this.state.touched['password']}
					/>
				</fieldset>
				<fieldset className='actions'>
					<button type='submit' disabled={!isDisabled} className='button button-primary'>Lagre</button>
				</fieldset>
			</form>
		);
	}

}
