import {sendRequest} from 'admin/apiAdminCommunication';

const Api = {
	/**
	 * Get all feedbacks
	 * @type {()=>Promise<any>}
	 */
	getFeedbacksList: function() {
		return sendRequest(`/admin/api/fb/`, 'GET');
	},

	/**
	 * Get all websites
	 * @type {()=>Promise<any>}
	 */
	getWebsiteList: function() {
		return sendRequest(`/admin/api/websites/`, 'GET');
	},

	/**
	 * Get website data by name
	 * @type {()=>Promise<any>}
	 */
	getSelectedWebsite: function(name) {
		return sendRequest(`/admin/api/websites/${name}`, 'GET');
	},
};
export default Api;
