import { readFileSync } from 'fs';
import { join } from 'path';

import * as app from 'app/util/applib';

let opengraphHTML : string = null;

export function getOpenGraphHTML() : string {
	if (opengraphHTML === null) {
		opengraphHTML = load('opengraph-meta.html');
	}
	return opengraphHTML;
}

function load(name : string) : string {
	return readFileSync(join(app.rootPath, 'resources', 'parser', name), 'utf-8');
}
