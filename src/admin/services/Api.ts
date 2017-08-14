import {sendRequest} from 'admin/apiAdminCommunication';
const Api = {
	/**
 * Get all feedbacks
 * @type {()=>Promise<any>}
 */
	getFeedbacksList: function(){
		return sendRequest(`/admin/api/fb/`, 'GET');
	},
};
export default Api;
