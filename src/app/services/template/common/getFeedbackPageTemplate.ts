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

import * as doT from 'dot';
import * as path from 'path';

import { isEmpty } from 'lodash';

import Website from 'base/Website';
import PageTemplate from 'base/PageTemplate';

import * as app from 'app/util/applib';
import emptyCheck from 'app/util/emptyCheck';

const defaultTemplate = path.join('templates', 'page', 'defaultFeedback.html');

export default function(website : Website) : Promise <PageTemplate> {
	emptyCheck(website);

	const rawTemplate = () : Promise <string> => {
		const raw = website.layout.templates.feedbackPage;
		return isEmpty(raw)
			? app.loadResource(defaultTemplate).then(buf => buf.toString('utf8'))
			: Promise.resolve(raw);
	};

	return rawTemplate().then((raw : string) => {
		return new PageTemplate (doT.template(raw))
			.pushStyle('/static/fb.css')
			.pushScript(
				'/static/react/react.js',
				'/static/react/react-dom.js',
				'/static/front.bundle.js'
			);
	});
}
