export default function isAuthenticated(req, res, next: () => void): void {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('login');
}
