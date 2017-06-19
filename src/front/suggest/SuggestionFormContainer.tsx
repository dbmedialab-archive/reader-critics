import * as React from 'react';

export interface FormPayload { username: string; email: string; comment: string; }

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
		};
	}

	// Helper class to update the components state when inputing values in text areas.
	private UpdateState(field : string, ref : any) {
		const state = {};
		state[ field ] = ref.value;
		this.setState( state );
	}

	public handleSubmit(e : any) {
		e.stopPropagation();
		console.log(this.state);
		//Send to backend Some info
	}

	public render() : JSX.Element {
		return (
			<form name='suggestBox' onSubmit={this.handleSubmit}>
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
						onChange={() => this.UpdateState('email', this.emailInput)}
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
					/>
				</fieldset>
				<fieldset className='actions'>
					<button type='submit' className='button save'>Lagre</button>
				</fieldset>
			</form>
		);
	}

}
