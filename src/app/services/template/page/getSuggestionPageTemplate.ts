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

import PageTemplate from 'app/template/PageTemplate';

import * as app from 'app/util/applib';

import {
	systemLocale,
	translate as __
} from 'app/services/localization';

const defaultTemplate = path.join('templates', 'page', 'defaultSuggestion.html');

export default function() : Promise <PageTemplate> {

	const rawTemplate = () : Promise <string> => {
		return app.loadResource(defaultTemplate).then(buf => buf.toString('utf8'));
	};

	return rawTemplate().then((raw : string) => {
		return new PageTemplate (doT.template(raw))
			.pushStyle('/static/fb.css')
			.pushScript(
				'/static/react/react.production.min.js',
				'/static/react/react-dom.production.min.js',
				`/static/locale/${systemLocale}.js`,
				`//www.google.com/recaptcha/api.js?hl=${systemLocale}`,
				'/static/front.bundle.js'
			)
			.setTitle(`${__('app.subtitle.fame-blame')} &ndash; ${__('app.title')}`);
		});
}
