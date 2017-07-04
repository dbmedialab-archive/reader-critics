import * as React from 'react';

import TestFormContainer from 'app/routes/admin/ui/testpage/TestFormContainer';

const TestContainer : React.StatelessComponent <any> =
	() => <div>
		<div className='confirmation'>
			<div className='container'>
				<div className='row section frontpage'>
					<div className='content u-full-width'>
						<TestFormContainer />
					</div>
				</div>
			</div>
		</div>
	</div>;

export default TestContainer;
