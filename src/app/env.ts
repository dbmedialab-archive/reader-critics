import printEnvironment from 'print-env';

import { createLog } from 'app/util/applib';

{
	const log = createLog();
	printEnvironment(log);
}
