import * as fs from 'fs';
import * as path from 'path';
import * as findRoot from 'find-root';

import { isTest } from './environment';

/** The filesystem root of the whole project */
export const rootPath : string = findRoot((isTest && process.env.CWD !== undefined)
	? process.env.CWD
	: path.dirname(require.main.filename));

export function loadResource(relativePath : string) : Promise <Buffer> {
	return new Promise((resolve, reject) => {
		const fullPath : string = path.join(rootPath, relativePath);

		fs.open(fullPath, 'r', (errOpen) => {
			if (errOpen) {
				if (errOpen.code === 'ENOENT') {
					return reject(new Error(`${fullPath} does not exist`));
				}

				return reject(errOpen);
			}

			fs.readFile(fullPath, (errRead, data : Buffer) => {
				if (errRead) {
					return reject(errRead);
				}

				return resolve(data);
			});
		});
	});
}

export function loadJSON(relativePath : string) : Promise <any> {
	return loadResource(relativePath)
		.then(buffer => JSON.parse(buffer.toString()));
}
