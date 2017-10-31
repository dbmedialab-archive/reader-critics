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

import * as callsite from 'callsite';
import { default as axios } from 'axios';
import { throttle } from 'lodash';

import config from 'app/config';

import * as app from 'app/util/applib';

const log = app.createLog('yell');

export enum Severity {
	Warning,
	Critical,
}

export function yell (
	err : Error,
	severity : Severity = Severity.Warning
) : void {
	log(err);

	// If the Slack integration isn't configured, we're done here
	if (config.get('slack.webhook')) {
		slackThrottled(err, severity, callsite());
	}
}

export function notify(text : string) : void {
	const slackPayload : any = {
		username: config.get('slack.botname'),
		icon_emoji: ':robot_face:',
		text,
	};

	if (config.get('slack.channel')) {
		slackPayload.channel = config.get('slack.channel');
	}

	axios.post(config.get('slack.webhook'), slackPayload)
	.then(() => null)
	.catch(() => null);
}

// Slack has a hard limit on messages that will be accepted from one sender.
// Bots that break this limit will be silenced until they are manually enabled
// again. So before risking to run into this limit, throttle the sending of
// Slack messages to one every two seconds. Should there really be this much
// traffic in the notification channel, someone better take a closer look anyway
// so it doesn't matter that we're probably discard some of the exceptions.
// They can be found in the application logs anyway.
const slackThrottled = throttle(slackIt, 2000, {
	leading: true,
	trailing: false,
});

function slackIt(
	err : Error,
	severity : Severity,
	callstack : callsite.CallSite[]
) : void {
	let text = `*${err.name}*: ${err.message}\n`;

	const csi = callstack[1];  // csi = short for "call site item", obviously
	text = text.concat(
		`in _${csi.getFileName().replace(app.rootPath, '')}_ - `,
		`line ${csi.getLineNumber().toString()} - `,
		csi.getFunctionName(),
		'\n'
	);

	const slackPayload : any = {
		username: config.get('slack.botname'),
		icon_emoji: getEmoji(severity),
		text,
	};

	if (config.get('slack.channel')) {
		slackPayload.channel = config.get('slack.channel');
	}

	axios.post(config.get('slack.webhook'), slackPayload)
	.then(() => null)
	.catch(() => null);
}

const getEmoji = (severity : Severity) : string => {
	switch (severity) {
		case Severity.Warning:
			return ':worried:';
		case Severity.Critical:
			return ':rage:';
	}
	return ':no_mouth:';
};
