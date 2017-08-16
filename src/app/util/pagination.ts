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
	Request
} from 'express';

import {
	defaultLimit,
	defaultSortOrder,
	defaultSortField,
} from '../services/BasicPersistingService';

const defaultPage = 1;

/*
 *	Responds with skip, limit and sort parameters
 *	If nothing came from request default will be used
 */
export default function(requ: Request) {
	var skip: number;
	var page: number = requ.query.page && requ.query.page > 0 ? requ.query.page : defaultPage;
	var limit: number = requ.query.limit || defaultLimit;
	var sortField: string = requ.query.sort || null;
	var sortOrder: string = requ.query.sortOrder || null;
	var sort : Object = {};
	
	if (page == 1) {
		skip = 0;
	} else {
		skip = limit * (page - 1);
	}
	
	if (sortField && sortOrder) {
		sort[sortField] = sortOrder;
	} else if (sortField && !sortOrder) {
		sort[sortField] = defaultSortOrder;
	} else if (!sortField && sortOrder) {
		sort[defaultSortField] = sortOrder;
	} else {
		sort[defaultSortField] = defaultSortOrder;
	}
	
	return { skip, limit, sort };
}