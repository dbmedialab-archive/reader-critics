import printEnv from 'print-env';

import { createLog } from 'util/applib';

{
	const log = createLog();
	printEnv(log);
}
