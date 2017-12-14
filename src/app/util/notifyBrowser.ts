//
// LESERKRITIKK v2 (aka Reader Critics)
// Copyright (C) 2017 DB Medialab/Aller Media AS, Oslo, Norway
// https://github.com/dbmedialab/reader-critics/
//
// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.
//
// This program is distributed in the hope that it will be useful, but WITHOUT
// ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
// FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License along with
// this program. If not, see <http://www.gnu.org/licenses/>.
//

// THIS FILE IS FOR TESTING PURPOSES ONLY

import { writeFileSync } from 'fs';
import { spawn } from 'child_process';

const testPath = '/tmp/mailtest.html';

// What's it doing? It stores the html input that some other function produced
// into a temporary file and launches a browser to show it. Very convenient
// for testing mail templates and other outputs from the template engine.

export function notifyBrowser(html : string) {
	writeFileSync(testPath, html, {
		flag: 'w',
		mode: 0o644,
	});

	spawn('/usr/bin/qupzilla', [ '-c', `file://${testPath}` ], {
		detached: true,
	});
}
