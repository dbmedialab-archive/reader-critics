import * as React from 'react';
import Helmet from 'react-helmet';
import {connect} from 'react-redux';
import * as PreloaderIcon from 'react-preloader-icon';
import {ICON_TYPE} from 'react-preloader-icon';

import SidebarComponent from 'admin/components/layout/SidebarComponent';
import TopbarComponent from 'admin/components/layout/TopbarComponent';

class LayoutComponent extends React.Component <any, any> {
	constructor(props) {
		super(props);
	}
	componentWillMount(){

	}
	bodyClicked() {

	}
	render() : JSX.Element {
		return(
			<div className="off-canvas-wrap">
				<div className="inner-wrap">
					<div onClick={this.bodyClicked} style={{height: '100%'}}>

						{this.props.mainPreloader.isVisible?
							<div className="preloaderSection">
									<PreloaderIcon
											type={ICON_TYPE.OVAL}
											size={50}
											strokeWidth={3}
											strokeColor={this.props.mainPreloader.color}
											duration={600}
									/>
							</div>
						:null}
						<Helmet title={this.props.pageTitle} />
						<SidebarComponent>
							{this.props.toSidebarContent}
						</SidebarComponent>
						<div className="paper-bg wrap-fluid" >
							<TopbarComponent
								isSubmenuOpen={this.props.isSubmenuOpen}
								isAccountMenuOpen={this.props.isAccountMenuOpen}
								currentUser={this.props.currentUser}
							/>
							<div className="content-wrapper">
								<div className="content">
									{this.props.mainPreloader.isVisible}
									{this.props.children}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	return {
		mainPreloader: {
			isVisible: state.UI.getIn(['mainPreloader', 'isVisible']),
			color: state.UI.getIn(['mainPreloader', 'color']),
		},
		pageTitle: 'Users',
		isSubmenuOpen: false,
		isAccountMenuOpen: false,
		currentUser: {
			name: 'Dmitry',
			role: 1,
		},
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(LayoutComponent);
