export default function isLoggedOff(req, res, next: () => void): void {
	if (!req.isAuthenticated()) {
		return next();
	}
	res.redirect('testpage');
}
