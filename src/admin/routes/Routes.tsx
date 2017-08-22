//
// LESERKRITIKK v2 (aka Reader Critics)
// Copyright (C) 2017 DB Medialab/Aller Media AS, Oslo, Norway
// https://github.com/dbmedialab/reader-critics/
//
// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.
//
// This program is distributed in the hope that it will be useful, but WITHOUT
// ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
// FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License along with
// this program. If not, see <http://www.gnu.org/licenses/>.
//

import * as React from 'react';
import { Route, Switch } from 'react-router';

import Users from 'admin/components/user/Users';
import Feedbacks from 'admin/components/feedbacks/FeedbacksContainer';
import Login from 'admin/components/login/Login';
import WebsiteContainer from 'admin/components/website/WebsiteContainer';

const Routes : React.StatelessComponent <any> =	() =>
	<Switch>
		<Route exact path="/" component={Users}/>
		<Route path="/login" component={Login}/>
		<Route path="/logout" component={Login}/>
		<Route path="/users" component={Users}/>
		<Route path="/feedbacks" component={Feedbacks}/>
		<Route path="/websites/:name" component={WebsiteContainer}/>

	</Switch>;
export default Routes;
