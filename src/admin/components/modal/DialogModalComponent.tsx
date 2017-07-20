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
import {connect} from 'react-redux';
import ReactModal from 'admin/components/modal/ReactModalComponent';
import * as UIActions from '../../actions/UIActions';

class DialogModal extends React.Component <any, any> {
	constructor(props) {
		super(props);

		this.closePopup = this.closePopup.bind(this);
		this.yesHandler = this.yesHandler.bind(this);
		this.noHandler = this.noHandler.bind(this);
	}
	componentWillMount(){
		UIActions.initModalWindows(this.props.windowName);
	}
	closePopup(){
		if (this.props.closeHandler) {
			this.props.closeHandler();
		}
		UIActions.hideDialog();
	}
	yesHandler(){
		if (this.props.yesHandler) {
			this.props.yesHandler();
		}
		this.closePopup();
	}
	noHandler(){
		if (this.props.noHandler){
			this.props.noHandler();
		}
		this.closePopup();
	}
	render() : JSX.Element {
		return (
			<ReactModal
				isOpen={this.props.isOpen}
				name={this.props.windowName}
				closeHandler={this.closePopup}
			>
				<div className="modal-window">
					<div className="close-btn">
						<i onClick={this.closePopup} className="fa fa-close"></i>
					</div>
					<div className="row">
						<div className="medium-12 columns">
							<p className="lead">{this.props.dialogTitle}</p>
						</div>
					</div>
					<div className="row button-holder">
						<div className="medium-12 columns">
							<a
								onClick={this.yesHandler}
								className="button alert"
								href="#">{this.props.yesBtnName}
							</a>
							<a
								onClick={this.noHandler}
								className="secondary button cancel-button"
								href="#">{this.props.noBtnName}
							</a>
						</div>
					</div>
				</div>
			</ReactModal>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	return {
		isOpen: state.UI.getIn(['modalWindows', ownProps.windowName, 'isOpen']),
		dialogTitle: state.UI.getIn(['modalWindows', ownProps.windowName, 'dialogTitle']) || '',
		yesHandler: state.UI.getIn(['modalWindows', ownProps.windowName, 'yesHandler']) || null,
		noHandler: state.UI.getIn(['modalWindows', ownProps.windowName, 'noHandler']) || null,
		yesBtnName: state.UI.getIn(['modalWindows', ownProps.windowName, 'yesBtnName']) || 'Yes',
		noBtnName:
			state.UI.getIn(['modalWindows', ownProps.windowName, 'noBtnName']) || 'No',
		closeHandler:
			state.UI.getIn(['modalWindows', ownProps.windowName, 'closeHandler']) || null,
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {};
};
export default connect(mapStateToProps, mapDispatchToProps)(DialogModal);
