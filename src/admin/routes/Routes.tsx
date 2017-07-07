import * as React from 'react';
import { Route, Switch } from 'react-router';

import Users from 'admin/components/user/Users';
import LoginLayout from 'admin/components/login/LoginLayout';
import TestLayout from 'admin/components/testpage/TestLayout';

export const Routes : React.StatelessComponent <any> =	() =>
	<Switch>
		<Route path="/users" component={Users}/>
		<Route path="/login" component={LoginLayout}/>
		<Route path="/testpage" component={TestLayout}/>
	</Switch>;
