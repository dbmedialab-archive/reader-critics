import * as cluster from 'cluster';

import master from './main/master';
import worker from './main/worker';

if (cluster.isMaster) {
	master();
}
else {
	worker();
}
