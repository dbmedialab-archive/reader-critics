import {sendRequest} from 'admin/apiAdminCommunication';
const Api = {
	/**
 * Get all feedbacks
 * @type {()=>Promise<any>}
 */
	getFeedbacksList: () =>
		sendRequest(`/admin/api/fb/`, 'GET'),

	/**
	 * Save or update user
	 * @type {(data: any) => Promise<any>}
	 */
	saveUser:(data: any): Promise<any> => {
		const userId = data.id || '';
		const method = userId.length ? 'PUT' : 'POST';
		return sendRequest(`/admin/api/users/${userId}`, method, data);
	},

	/**
	 * Get users
	 * @type {() => Promise<any>}
	 */

	getUsers:(): Promise<any> =>
		sendRequest(`/admin/api/users`, 'GET'),

	/**
	 * Delete User
	 * @type {(userId: any) => Promise<any>}
	 */

	deleteUser:(userId: any): Promise<any> =>
		sendRequest(`/admin/api/users/${userId}`, 'DELETE'),
};
export default Api;
