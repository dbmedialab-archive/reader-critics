import MainStore from 'admin/stores/MainStore';
import * as UIActionsCreator from 'admin/actions/UIActionsCreator';
import * as UIActions from './UIActions';
import AdminConstants from 'admin/constants/AdminConstants';

export interface PromptInterface {
	isOpen: boolean;
	okHandler?: any;
	cancelHandler?: any;
	okBtnName?: string;
	cancelBtnName?: string;
	promptTitle?: string;
	promptInputErrorValidationMsg?: string;
	validationSchema?: any;
	yesHandler?: any;
	noHandler?: any;
	yesBtnName?: string;
	noBtnName?: string;
	dialogTitle?: string;
	promptInput?: any;
}

export function initModalWindows(windowNames) {
	MainStore.dispatch(
		UIActionsCreator.initModalWindows({windowNames: windowNames}),
	);
}
export function modalWindowsChangeState(windowName, options) {
	MainStore.dispatch(
		UIActionsCreator.modalWindowsChangeState({windowName: windowName, options: options}),
	);
}

export function showPrompt(options) {
	options.isOpen = true;
	UIActions.modalWindowsChangeState(AdminConstants.PROMPT_MODAL_WINDOW, options);
}

export function hidePrompt() {
	const options: PromptInterface = {
		isOpen: false,
		okHandler: null,
		cancelHandler: null,
		okBtnName: '',
		cancelBtnName: '',
		promptTitle: '',
		promptInputErrorValidationMsg: '',
		validationSchema: null,
		promptInput: null,
	};
	UIActions.modalWindowsChangeState(AdminConstants.PROMPT_MODAL_WINDOW, options);
}

export function showDialog(options) {
	options.isOpen = true;
	UIActions.modalWindowsChangeState(AdminConstants.DIALOG_MODAL_WINDOW, options);
}

export function hideDialog() {
	const options: PromptInterface = {
		isOpen: false,
		yesHandler: null,
		noHandler: null,
		yesBtnName: '',
		noBtnName: '',
		dialogTitle: '',
	};

	UIActions.modalWindowsChangeState(AdminConstants.DIALOG_MODAL_WINDOW, options);
}

export function closeReset(windowName){
	const data = {windowName: windowName};
	MainStore.dispatch({
		type: AdminConstants.RESET_FORM_INPUT,
		payload: data,
	});
}

export function toggleMainPreloader(options){
	MainStore.dispatch({
		type: AdminConstants.MAIN_PRELOADER_CHANGE_STATE,
		payload: options,
	});
}

export function showMainPreloader(props = null){
	const options = props || {};
	options.isVisible = true;
	UIActions.toggleMainPreloader(options);
}
export function hideMainPreloader(props = null){
	const options = props || {};
	options.isVisible = false;
	UIActions.toggleMainPreloader(options);
}
