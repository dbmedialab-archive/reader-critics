import printEnv from 'print-env';

import { createLog } from 'app/util/applib';

{
	const log = createLog();
	printEnv(log);
}
