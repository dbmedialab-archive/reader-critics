import 'whatwg-fetch';

//USERS API
/**
 * Save or update user
 * @type {(data: any) => Promise<any>}
 */
export const saveUser = ((data: any): Promise<any> => {
	const userId = data.id || '';
	const method = userId.length ? 'PUT' : 'POST';
	return fetch(`/admin/api/users/${userId}`, {
		method: method,
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data),
	})
		.then(status)
		.then(json)
		.catch((error) => console.log('request failed', error));
});
/**
 * Get users
 * @type {() => Promise<any>}
 */
export const getUsers = ((): Promise<any> => {
	return fetch('/admin/api/users/')
		.then(status)
		.then(json)
		.then((data) => data)
		.catch((error) => console.log('request failed', error));
});

/**
 * Delete User
 * @type {(userId: any) => Promise<any>}
 */
export const deleteUser = ((userId: any): Promise<any> => {
	return fetch(`/admin/api/users/${userId}`, {
		method: 'DELETE',
		headers: { 'Content-Type': 'application/json' },
	})
		.then(status)
		.then((response) => response)
		.catch((error) => console.log('request failed', error));
});

//HELPERS
const json = (response) => response.json().then(j => j);
function status(response: Response) {
	if (response.status >= 200 && response.status < 300) {
		return response;
	}
	throw new Error(response.statusText);
}
