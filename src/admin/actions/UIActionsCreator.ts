import AdminConstants from 'admin/constants/AdminConstants';
export interface Dispatch {
		type: string;
		payload: any;
}

export function initModalWindows(payload): Dispatch {
	return {
		type: AdminConstants.MODAL_INIT,
		payload: payload,
	};
}
export function modalWindowsChangeState(payload): Dispatch {
	return {
		type: AdminConstants.MODAL_STATE_CHANGED,
		payload: payload,
	};
}
