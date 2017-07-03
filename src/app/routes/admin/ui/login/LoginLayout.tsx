import * as React from 'react';
import '../../../../../front/scss/app.scss';

// Common components
import Header from 'front/common/Header';
import Footer from 'front/common/Footer';
import LoginContainer from 'app/routes/admin/ui/login/LoginContainer';

const LoginLayout : React.StatelessComponent <any> =
	() => <div>
		<Header/>
		<LoginContainer/>
		<Footer/>
	</div>;

export default LoginLayout;
