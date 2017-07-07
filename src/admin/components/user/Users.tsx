import * as React from 'react';
import 'front/scss/app.scss';

// Common components
import  * as UIActions from 'admin/actions/UIActions';

import Layout from 'admin/components/layout/LayoutComponent';

class Users extends React.Component <any, any> {
	constructor(props) {
		super(props);
	}
	onBtnClick(){
		UIActions.initModalWindows('test');
	}
	render(){
		return (<Layout>
			Users page<br/>
			<div className="button" onClick={this.onBtnClick.bind(this)}>Click me</div>
		</Layout>);
	}
}
export default Users;
