//
// LESERKRITIKK v2 (aka Reader Critics)
// Copyright (C) 2017 DB Medialab/Aller Media AS, Oslo, Norway
// https://github.com/dbmedialab/reader-critics/
//
// This program is free software: you can redistribute it and/or modify it
// under
// the terms of the GNU General Public License as published by the Free
// Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.
//
// This program is distributed in the hope that it will be useful, but WITHOUT
// ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
// FITNESS
// FOR A PARTICULAR PURPOSE. See the GNU General Public License for more
// details.  You should have received a copy of the GNU General Public License
// along with this program. If not, see <http://www.gnu.org/licenses/>.
import * as React from 'react';

// Common components

import Layout from '../layout/LayoutComponent';

import UserList from 'admin/components/user/UserList';
import AddUserModalComponent from 'admin/components/modal/AddUserModalComponent';

import * as AppConstants from 'admin/constants/AppConstants';

const User : React.StatelessComponent <any> =
	() => <Layout>
		<UserList />
		<AddUserModalComponent windowName={AppConstants.USER_MODAL_NAME} />
	</Layout>;

export default User;
