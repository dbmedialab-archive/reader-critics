import * as fs from 'fs';
import * as path from 'path';
import * as app from 'app/util/applib';

export const mapSitesToParser = Object.freeze({
	'dagbladet.no': 'Dagbladet Parser',
	'nettavisen.no': 'Nettavisen Parser',
});

export function collectArticleFiles() : string[] {
	const articlePath = path.join(app.rootPath, 'resources', 'article', 'html');
	return fs.readdirSync(articlePath);
}
