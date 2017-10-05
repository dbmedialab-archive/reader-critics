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

import * as React from 'react';

import MainMenuComponent from 'admin/components/layout/MainMenuComponent';

const SidebarComponent: React.StatelessComponent <any> = () =>
	<div className="skin-select hide-for-small-only">
		<a className="toggle active show-on-focus">
			<span className="fa fa-bars"></span>
		</a>
		<div className="skin-part">
			<div className="tree-wrap">

				<div className="profile">
					<img className="logo" src="/static/images/logo/leserkritikk-logo-color.svg"/>
				</div>
				<div className="side-bar">
					<MainMenuComponent />
				</div>
			</div>
		</div>
	</div>;

export default SidebarComponent;
