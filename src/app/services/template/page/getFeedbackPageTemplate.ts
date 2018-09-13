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

import emptyCheck from 'app/util/emptyCheck';
import PageTemplate from 'app/template/PageTemplate';
import Website from 'base/Website';

import { localizationService } from 'app/services';

import * as app from 'app/util/applib';

import chooseTemplate from 'app/services/template/chooseTemplate';

const __ = localizationService.translate;
const defaultTemplate = path.join('templates', 'page', 'defaultFeedback.html');

export default function(website : Website) : Promise <PageTemplate> {
	emptyCheck(website);

	const templateSettings = Object.assign({}, doT.templateSettings, {
		strip: app.isProduction,
	});

	return chooseTemplate(website.layout.templates.feedbackPage, defaultTemplate)
		.then((raw : string) => {
			return new PageTemplate (doT.template(raw, templateSettings), website.locale)
				.pushStyle('/static/fb.css')
				.pushScript(
					'/static/react/react.development.js',
					'/static/react/react-dom.development.js',
					`/static/locale/${website.locale}.js`,
					'/static/front.bundle.js'
				)
				.setTitle(__('app.title', website.locale));
		});
}
