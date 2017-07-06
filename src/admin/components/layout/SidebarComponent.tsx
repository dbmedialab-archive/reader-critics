import * as React from 'react';
import {connect} from 'react-redux';

import MainMenuComponent from 'admin/components/layout/MainMenuComponent';

class SidebarComponent extends React.Component <any, any> {

	public render() : JSX.Element {
		return(
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
			</div>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	return {};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(SidebarComponent);
