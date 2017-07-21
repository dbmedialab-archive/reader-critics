import * as React from 'react';

import Layout from 'admin/components/layout/LoginLayoutComponent';
import LoginModalComponent from 'admin/components/modal/LoginModalComponent';
import AdminConstants from 'admin/constants/AdminConstants';

class Login extends React.Component <any, any> {
	constructor(props) {
		super(props);

		this.getBack = this.getBack.bind(this);
	}

	getBack() {
		this.props.history.replace('/');
	}

	render() {
		console.log(this.props.history);
		return (<Layout>
			<LoginModalComponent
				windowName={AdminConstants.LOGIN_DIALOG_MODAL_WINDOW}
				getBack={this.getBack}
			/>
		</Layout>);
	}
}

export default Login;
