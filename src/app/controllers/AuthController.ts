import User from '../models/User';

const adminUser = new User('admin', 'admin', 'test');

export default class AuthController {
	public static authenticate(req, res, next) {
		if (req.body.login && req.body.password) {
			adminUser.checkPassword(req.body.password, (isMatch) => {
				if (isMatch) {
					req.user = adminUser;
				}
				next();
			});
		}
		return next();
	}
}