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
				<div className="modalWindow">
					<div className="closeBtn">
						<i onClick={this.closePopup} className="fa fa-close"></i>
					</div>
					<div className="row">
						<div className="medium-12 columns">
							<p className="lead">{this.props.dialogTitle}</p>
						</div>
					</div>
					<div className="row button_holder">
						<div className="medium-12 columns">
							<a
								onClick={this.yesHandler}
								className="button alert"
								href="#">{this.props.yesBtnName}
							</a>
							<a
								onClick={this.noHandler}
								className="secondary button cancel_button"
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
