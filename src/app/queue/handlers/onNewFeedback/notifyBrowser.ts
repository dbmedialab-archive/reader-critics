import { writeFileSync } from 'fs';
import { spawn } from 'child_process';

// Only for development

const testPath = '/tmp/mailtest.html';

export default function (html : string) {
	writeFileSync(testPath, html, {
		flag: 'w',
		mode: 0o644,
	});

	spawn('/usr/bin/qupzilla', [ '-c', `file://${testPath}` ], {
		detached: true,
	});
}
