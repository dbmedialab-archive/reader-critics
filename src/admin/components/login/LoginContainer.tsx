import * as React from 'react';

import LoginFormContainer from 'admin/components/login/LoginFormContainer';

const LoginContainer : React.StatelessComponent <any> =
	() => <div>
		<div className="confirmation">
			<div className="container">
				<div className="row section frontpage">
					<div className="content u-full-width">
						<LoginFormContainer />
					</div>
				</div>
			</div>
		</div>
	</div>;

export default LoginContainer;
