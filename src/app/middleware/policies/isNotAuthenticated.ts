export default function (req, res, next: () => void): void {
	if (!req.isAuthenticated()) {
		return next();
	}
	res.redirect('testpage');
}
