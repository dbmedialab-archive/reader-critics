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

import { Schema } from 'mongoose';
import { systemLocale } from 'app/services/localization';

const WebsiteSchema : Schema = new Schema({
	name: {
		type: String,
		required: true,
	},
	hosts: {
		type: [String],
		required: true,
	},

	locale: {
		type: String,
		required: false,
		default: systemLocale,
	},

	chiefEditors: [Schema.Types.Mixed],

	parserClass: {
		type: String,
		required: false,
		default: null,
	},

	layout: {
		templates: {
			feedbackPage: {
				type: String,
				required: false,
				default: null,
			},
		},
		scssVariables: {
			type: Object,
			required: false,
			default: null,
		},
	},
});

WebsiteSchema.index({
	'name': 1,
}, {
	name: 'unique_name',
	unique: true,
});

WebsiteSchema.index({
	'hosts': 1,
}, {
	name: 'unique_hosts',
	unique: true,
});

export default WebsiteSchema;
