import * as React from 'react';
import {connect} from 'react-redux';
import ReactModal from 'admin/components/modal/ReactModalComponent';
import * as UIActions from 'admin/actions/UIActions';
import Validation from "admin/services/Validation";
import * as Joi from 'joi-browser';

const promptInput = 'promptInput';

class PromptModal extends React.Component <any, any> {
	constructor(props) {
		super(props);

		this.closePopup = this.closePopup.bind(this);
		this.okHandler = this.okHandler.bind(this);
		this.cancelHandler = this.cancelHandler.bind(this);
		this.updatePromptInputValue = this.updatePromptInputValue.bind(this);
		this.getCurrentInput = this.getCurrentInput.bind(this);
		this.onFocus = this.onFocus.bind(this);
		this.onBlur = this.onBlur.bind(this);
	}
	componentWillMount():void{
		UIActions.initModalWindows(this.props.windowName);
	}
	closePopup(): void{
		UIActions.hidePrompt();
	}
	okHandler(): void{
		if (!this.props[promptInput].valid.isError && this.props[promptInput].value !== '') {
			if (this.props.okHandler) {
				this.props.okHandler(this.props[promptInput].value);
			}
			this.closePopup();
		}
	}
	cancelHandler(): void{
		if (this.props.cancelHandler) {
			this.props.cancelHandler();
		}
		this.closePopup();
	}
	updatePromptInputValue(event): void {
		const options = this.getCurrentInput(event.target.name);
		options[event.target.name].value = event.target.value;
		UIActions.modalWindowsChangeState(this.props.windowName, options);
	}
	getCurrentInput(propName) {
		const options = {};
		options[propName] = this.props[propName];
		options[propName].touched = true;
		return options;
	}
	onFocus(event): void{
		const name = event.target.name;
		this.props[name].touched = true;
	}
	onBlur(event): void {
		const options = this.getCurrentInput(event.target.name);
		UIActions.modalWindowsChangeState(this.props.windowName, options);
	}
	render() : JSX.Element {
		const promptClassName = this.props.promptInput.touched && this.props.promptInput.valid.isError ? 'is-invalid-input' : '';
		return (
			<ReactModal isOpen={this.props.isOpen} name="newComic" closeHandler={this.closePopup}>
				<div className="modalWindow">
					<div className="closeBtn">
						<i onClick={this.closePopup} className="fa fa-close"></i>
					</div>
					<div className="row">
						<div className="medium-12 columns">
							<p className="lead">{this.props.promptTitle}</p>
						</div>
					</div>
					<form>
						<div className="row">
							<div className="medium-12 columns">
								<label>
									<input onBlur={this.onBlur} onFocus={this.onFocus} className={promptClassName} name={promptInput} value={this.props.promptInput.value} onChange={this.updatePromptInputValue} type="text" placeholder='' />
									{this.props.promptInput.touched && ((this.props.promptInput.valid.isError && <span className="form-error is-visible">{this.props.promptInput.valid.message}</span>))}
								</label>
							</div>
						</div>
					</form>
					<div className="row button_holder">
						<div className="medium-12 columns">
							<a onClick={this.okHandler} className="secondary button save_button" href="#">{this.props.okBtnName}</a>
							<a onClick={this.cancelHandler} className="secondary button cancel_button" href="#">{this.props.cancelBtnName}</a>
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
		promptInput: {
			value: state.UI.getIn(['modalWindows', ownProps.windowName, promptInput, 'value']) || '',
			touched: state.UI.getIn(['modalWindows', ownProps.windowName, promptInput, 'touched']) || false,
			valid: Validation.validate(
				{
					schema: state.UI.getIn(['modalWindows', ownProps.windowName, promptInput, 'validationSchema']) || Joi.any(),
					message: state.UI.getIn(['modalWindows', ownProps.windowName, promptInput, 'promptInputErrorValidationMsg']) || ''
				},
				state.UI.getIn(['modalWindows', ownProps.windowName, promptInput, 'value'])
			)
		},
		promptTitle: state.UI.getIn(['modalWindows', ownProps.windowName, 'promptTitle'])|| '',
		okHandler: state.UI.getIn(['modalWindows', ownProps.windowName, 'okHandler'])|| null,
		cancelHandler: state.UI.getIn(['modalWindows', ownProps.windowName, 'cancelHandler']) || null,
		okBtnName: state.UI.getIn(['modalWindows', ownProps.windowName, 'okBtnName'])|| 'Ok',
		cancelBtnName: state.UI.getIn(['modalWindows', ownProps.windowName, 'cancelBtnName']) || 'Cancel',
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return { };
};
export default connect(mapStateToProps, mapDispatchToProps)(PromptModal);
