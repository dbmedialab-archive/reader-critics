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

import * as path from 'path';

import {
	static as serveStatic,
	Router,
} from 'express';

import * as app from 'app/util/applib';

const staticRoute : Router = Router();

staticRoute.use('/images', serveStatic(path.join(app.rootPath, 'assets/images')));
staticRoute.use('/styles', serveStatic(path.join(app.rootPath, 'assets/styles')));

staticRoute.use('/admin/images', serveStatic(path.join(app.rootPath, 'assets/admin/images')));
staticRoute.use('/admin/styles', serveStatic(path.join(app.rootPath, 'assets/admin/styles')));

// We don't bundle frontend libraries together with the compiled sources, but rather host
// them from static endpoints. Fair tradeoff between enabled browser caching but not using
// a CDN for those libs and being able to upgrade them easily through NPM or Yarn locally.
staticRoute.use('/react', serveStatic(path.join(app.rootPath, 'node_modules/react/dist/')));
staticRoute.use('/react', serveStatic(path.join(app.rootPath, 'node_modules/react-dom/dist/')));

staticRoute.use('/', serveStatic(path.join(app.rootPath, 'out/bundle')));

export default staticRoute;
