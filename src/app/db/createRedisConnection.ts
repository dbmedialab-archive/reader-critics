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

import * as colors from 'ansicolors';
import * as IORedis from 'ioredis';
import * as stripUrlAuth from 'strip-url-auth';

import config from 'app/config';

import * as app from 'app/util/applib';

const log = app.createLog('redis');

export const dbMessageQueue = 'message-queue';
export const dbSessionCache = 'session-cache';

export default function(which : string) : {} {
	if (![dbMessageQueue, dbSessionCache].includes(which)) {
		throw new Error(`Unknown Redis database "${which}"`);
	}

	const url = config.get(`db.redis.url.${which}`);
	const redis : IORedis.Redis = new IORedis(url);

	redis.on('connect', () => {
		log('Connecting to %s at %s', which, colors.brightWhite(stripUrlAuth(stripUrlAuth(url))));
	});
	redis.on('reconnecting', () => {
		log('Reconnecting ', which);
	});

	return redis;
}
