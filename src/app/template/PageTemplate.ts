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

import { RenderFunction } from 'dot';

import {
	isEmpty,
	isObject,
	isString,
} from 'lodash';

import { translate as __ } from 'app/services/localization';

import AbstractTemplate from './AbstractTemplate';

export default class PageTemplate extends AbstractTemplate {

	private scripts : string[] = [];
	private styles : string[] = [];

	private params : Object = {};

	private title : string = __('app.title');

	public pushScript(...jsFileURIs : string[]) : PageTemplate {
		jsFileURIs.forEach(uri => {
			if (isString(uri) && !isEmpty(uri)) {
				this.scripts.push(uri);
			}
		});
		return this;
	}

	public pushStyle(...cssFileURIs : string[]) : PageTemplate {
		cssFileURIs.forEach(uri => {
			if (isString(uri) && !isEmpty(uri)) {
				this.styles.push(uri);
			}
		});
		return this;
	}

	public setTitle(title : string) : PageTemplate {
		if (isString(title) && !isEmpty(title)) {
			this.title = title;
		}
		return this;
	}

	public setParams(params : Object) : PageTemplate {
		if (isObject(params) && !isEmpty(params)) {
			this.params = params;
		}
		return this;
	}

	public render() : string {
		return this.dotRender({
			params: JSON.stringify(this.params),
			locale: this.locale,
			scripts: this.scripts,
			styles: this.styles,
			title: this.title,
		});
	}

}
