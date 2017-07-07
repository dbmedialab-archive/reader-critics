import * as React from 'react';

// Common components
import Header from 'front/common/Header';
import Footer from 'front/common/Footer';
import LoginContainer from 'admin/components/login/LoginContainer';

const LoginLayout : React.StatelessComponent <any> =
	() => <div>
		<Header/>
		<LoginContainer/>
		<Footer/>
	</div>;

export default LoginLayout;
