import * as React from 'react';

const TestFormContainer: React.StatelessComponent<any> =
	() => (
		<form name='testBox' action='/admin/logout' method='GET' className='eleven login columns feedbackform'>
			<button type='submit' className='button button-primary'>
				Logg ut
			</button>
		</form>
	);

export default TestFormContainer;
