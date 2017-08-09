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
