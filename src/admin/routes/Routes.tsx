import * as React from 'react';
import { Route, Switch } from 'react-router';

import Users from 'admin/components/user/Users';

const Routes : React.StatelessComponent <JSX.Element> =	() =>
	<Switch>
			<Route path="/users" component={Users}/>
	</Switch>;

export Routes;
