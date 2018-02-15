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

	// Language setting for this website (a ISO 639-1 code)
	locale: {
		type: String,
		required: false,
		default: systemLocale,
	},

	// Fallback e-mail addresses and related options
	chiefEditors: [Schema.Types.Mixed],

	// Articles with a feedback count greater or equal to the values configured
	// here will trigger an escalation notification
	escalateThreshold: {
		toEditor: {
			type: Number,
			required: false,
		},
	},

	// Turning this on will send all outgoing notification e-mails on the
	// customer side to the configured editors *only*. Authors of articles will
	// not receive notifications, even if their mail addresses could be parsed
	// from the articles. This setting does *not* affect e-mails that go out
	// to endusers.
	onlyNotifyEditors: {
		type: Boolean,
		required: false,
		default: false,
	},

	// Article parser
	parserClass: {
		type: String,
		required: false,
		default: null,
	},

	// Digest of unrevised articles
	unrevisedDigest: {
		// Flag to switch on the digests for this website
		isActive: {
			type: Boolean,
			required: false,
			default: false,
		},
		// The timestamp of when the digest cronjob was run the last time
		lastRun: {
			type: Date,
			required: false,
			default: null,
		},
		// The hour of the day in which the digest cronjob should run
		cronHour: {
			type: Number,
			required: false,
			default: 6,
		},
	},

	// Website-specific layout
	layout: {
		templates: {
			feedbackPage: {
				type: String,
				required: false,
				default: null,
			},
			escalateToEditorMail: {
				type: String,
				required: false,
				default: null,
			},
			feedbackNotificationMail: {
				type: String,
				required: false,
				default: null,
			},
			unrevisedDigestMail: {
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
