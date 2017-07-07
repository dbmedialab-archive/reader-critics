import * as React from 'react';
import 'front/scss/app.scss';

// Common components

import Layout from 'admin/components/layout/LayoutComponent';

const Users : React.StatelessComponent <any> =
	() => <Layout>
		Users page<br/>
		<div className="button">Click me</div>
	</Layout>;

export default Users;
