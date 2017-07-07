import * as React from 'react';
import { Route, Switch } from 'react-router';

import Users from 'admin/components/user/Users';

const Routes : React.StatelessComponent <any> =	() =>
	<Switch>
			<Route path="/users" component={Users}/>
	</Switch>;
export default Routes;
