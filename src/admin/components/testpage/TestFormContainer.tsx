import * as React from 'react';
import { sendUsersRequest } from 'admin/apiAdminCommunication';

function sendRequest(event) {
	event.preventDefault();
	sendUsersRequest().then((res: any): void => {
		console.log(res);
	}, (err: any): void => {
		console.log(err);
		console.log('errored');
	});
}

const TestFormContainer: React.StatelessComponent<any> =
	() => (
		<form
			name='testBox' action='/admin/logout' method='GET'
			className='eleven login columns feedbackform'
		>
			<button type='submit' className='button button-primary'>
				Logg ut
			</button>
			<button className='button button-primary' onClick={sendRequest}>
				Check users
			</button>
		</form>
	);

export default TestFormContainer;
