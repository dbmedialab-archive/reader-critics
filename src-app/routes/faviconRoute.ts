import * as favicon from 'serve-favicons';

import * as app from 'util/applib';

export default favicon({
	'/favicon.ico': new Buffer(20), // app.rootPath + '/assets/favicon.ico',
	'/favicon-152.png': new Buffer(20), // app.rootPath + '/assets/favicon-152.png',
	'/favicon-144.png': new Buffer(20)
});
