import * as favicon from 'serve-favicons';

console.log('favicon:', __dirname);

const handler = favicon({
	'/favicon.ico': new Buffer(20), // __dirname + '/public/favicon.ico',
	'/favicon-152.png': new Buffer(20), // __dirname + '/public/favicon-152.png',
	'/favicon-144.png': new Buffer(20)
});

export default handler;
