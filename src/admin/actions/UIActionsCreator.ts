import AdminConstants from 'admin/constants/AdminConstants';
export interface IAction {
		type: any;
		payload?: any;
}

export type TAction = IAction;
export function initModalWindows(payload): IAction {
	return {
		type: AdminConstants.MODAL_INIT,
		payload,
	};
}
export function modalWindowsChangeState(payload): IAction {
	return {
		type: AdminConstants.MODAL_STATE_CHANGED,
		payload,
	};
}
