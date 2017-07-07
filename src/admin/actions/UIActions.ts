import AppConstants from 'admin/constants/AdminConstants';
import {MainStore} from 'admin/stores/MainStore';
import * as UIActionsCreator from 'admin/actions/UIActionsCreator';

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
