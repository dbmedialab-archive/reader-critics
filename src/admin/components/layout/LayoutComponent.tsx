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
import * as PreloaderIcon from 'react-preloader-icon';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { ICON_TYPE } from 'react-preloader-icon';
import AdminConstants from 'admin/constants/AdminConstants';

import * as UIActions from 'admin/actions/UIActions';
import SidebarComponent from 'admin/components/layout/SidebarComponent';
import TopbarComponent from 'admin/components/layout/TopbarComponent';
import PromptModalComponent from 'admin/components/modal/PromptModalComponent';
import DialogModalComponent from 'admin/components/modal/DialogModalComponent';

class LayoutComponent extends React.Component <any, any> {
	constructor(props) {
		super(props);
		this.bodyClicked = this.bodyClicked.bind(this);
	}
	bodyClicked() {
			if (this.props.isSubmenuOpen) {
				UIActions.topbarSubmenuChangeState(false);
			}
			if (this.props.isAccountMenuOpen) {
				UIActions.topbarAccountMenuChangeState(false);
			}
	}
	render() : JSX.Element {
		return(
			<div className="off-canvas-wrap" onClick={this.bodyClicked}>
				<div className="inner-wrap">
					<div style={{height: '100%'}}>

						{this.props.mainPreloader.isVisible?
							<div className="preloader-section">
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
						<SidebarComponent />
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
				<PromptModalComponent windowName={AdminConstants.PROMPT_MODAL_NAME} />
				<DialogModalComponent windowName={AdminConstants.DIALOG_MODAL_WINDOW} />
				<footer>
					<div id="err-section"></div>
				</footer>
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
		isSubmenuOpen: state.UI.getIn(['topbar', 'submenu','isOpen']),
		isAccountMenuOpen: state.UI.getIn(['topbar', 'accountMenu','isOpen']),
		currentUser: {
			role: state.user.getIn(['role']) || null,
			name: state.user.getIn(['name']) || '',
		},
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(LayoutComponent);
