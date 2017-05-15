// Application environment

/** The current environment that this app is running in */
const findEnvironment = () => {
	let e = process.env.NODE_ENV || null;
	if (0 > ['production', 'development', 'test'].indexOf(e)) {
		e = 'development';
	//	throw new Error(`Unknown execution environment "${e}"`);
		console.log(`Execution environment not set, assuming "${e}"`);
	}
	return e;
};

export const env : string = findEnvironment();
