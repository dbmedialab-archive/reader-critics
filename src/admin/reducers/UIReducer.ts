import * as  UIActionsCreator  from 'admin/actions/UIActionsCreator';
import UIType from 'admin/types/UIType';
import AdminConstants from 'admin/constants/AdminConstants';

const initialState:UIType = {
	modalWindows:[],
};
function UIReducer(state: UIType = initialState, action: UIActionsCreator.TAction): UIType {
	switch (action.type) {
		case AdminConstants.MODAL_INIT:
			return state;
		default:
			return state;
	}
}

export default UIReducer;
