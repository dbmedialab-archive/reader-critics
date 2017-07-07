import * as React from 'react';

import MainMenuComponent from 'admin/components/layout/MainMenuComponent';

const SidebarComponent: React.StatelessComponent <any> = () =>
	<div className="skin-select hide-for-small-only">
		<a className="toggle active show-on-focus">
			<span className="fa fa-bars"></span>
		</a>
		<div className="skin-part">
			<div className="tree-wrap">

				<div className="profile">
					<img className="logo" src="/static/admin/images/logo.png"/>
					<h3>LESERKRITIKK<span className="app-version">0.0.4</span></h3>
				</div>
				<div className="side-bar">
					<MainMenuComponent />
				</div>
			</div>
		</div>
	</div>;

export default SidebarComponent;
