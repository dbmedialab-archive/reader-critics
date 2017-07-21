import * as React from 'react';

import Layout from 'admin/components/layout/LoginLayoutComponent';
import LoginModalComponent from 'admin/components/modal/LoginModalComponent';
import AdminConstants from 'admin/constants/AdminConstants';
import * as UserActions from 'admin/actions/UserActions';

class Login extends React.Component <any, any> {
	constructor(props) {
		super(props);

		this.getBack = this.getBack.bind(this);
		if (this.props.history.location.pathname !== 'login') {
			UserActions.deauthenticate();
		}
	}

	getBack() {
		this.props.history.replace('/');
	}

	render() {
		return (<Layout>
			<LoginModalComponent
				windowName={AdminConstants.LOGIN_DIALOG_MODAL_WINDOW}
				getBack={this.getBack}
			/>
		</Layout>);
	}
}

export default Login;
