import * as path from 'path';
import * as findRoot from 'find-root';

/** The filesystem root of the whole project */
export const rootPath = findRoot(path.dirname(require.main.filename));
