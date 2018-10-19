import * as fs from 'fs';
import * as path from 'path';
import * as app from 'app/util/applib';

export const mapSitesToParser = Object.freeze({
	'dagbladet.no': 'Dagbladet Parser',
	'dinside.no': 'Dinside Parser',
	'nettavisen.no': 'Nettavisen Parser',
	'sol.no': 'Sol Parser',
});

const htmlPath = path.join('resources', 'article', 'html');
const jsonPath = path.join('resources', 'article', 'json');

export function collectArticleFiles() : string[] {
	return fs.readdirSync(path.resolve(app.rootPath, htmlPath));
}

export function loadResultJSON(htmlFileName : string) : Promise <{}> {
	const jsonFileName = htmlFileName.replace(/\.html$/, '.json5');
	return app.loadJSON(path.join(jsonPath, jsonFileName));
}
