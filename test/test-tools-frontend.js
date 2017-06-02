const findRoot = require('find-root');
const path = require('path');

const rootPath = path.join(findRoot(path.dirname(__dirname)), 'out');

const config = require(rootPath + '/app/config.js').default;

function openPage(client, path = '/') {
	return client.url('http://localhost:' + config.get('http.port') + path);
}

module.exports = {
	openPage,
};
