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

import {
	Request,
	Response,
	Router,
} from 'express';

import config from 'app/config';

import {
	localizationService,
	templateService,
} from 'app/services';

import PageTemplate from 'base/PageTemplate';
import { systemLocale } from 'app/services/localization';

const suggestionRoute : Router = Router();

suggestionRoute.get('/', suggestionHandler);

export default suggestionRoute;

function suggestionHandler(requ : Request, resp : Response) {
	return Promise
		.all([
			templateService.getSuggestionPageTemplate(),
			localizationService.getFrontendStrings(),
		])
		// Use the page template, inject parameters and serve to the client
		.spread((template : PageTemplate, localStrings : any) => {
			resp.set('Content-Type', 'text/html')
				.send(template.setParams({
					recaptcha: {
						publicKey: config.get('recaptcha.key.public'),
					},
					localization: {
						locale: systemLocale,
						messages: localStrings,
					},
				}).render())
				.status(200).end();
		});
}
