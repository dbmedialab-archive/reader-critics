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

import { Link } from 'react-router-dom';

const MainMenuComponent : React.StatelessComponent <any> = () =>
		<ul className="menu-nav">
				<li className="menu-item">
					<Link
							to="/feedbacks"
							className="tooltip-tip tooltipster-disable"
							title="All feedbacks"
						>
							<i className="fa fa-list-ul" />
							<span>Feedbacks</span>
					</Link>
					<Link
						to="/articles"
						className="tooltip-tip tooltipster-disable"
						title="All articles"
					>
						<i className="fa fa-list-ul" />
						<span>Articles</span>
					</Link>
					<Link
						to="/suggestions"
						className="tooltip-tip tooltipster-disable"
						title="All suggestions"
					>
						<i className="fa fa-list-ul" />
						<span>Suggestions</span>
					</Link>
					<Link
							to="/users"
							className="tooltip-tip tooltipster-disable"
							title="All users"
						>
							<i className="fa fa-users" />
							<span>Users</span>
					</Link>
					<Link
						to="/websites"
						className="tooltip-tip tooltipster-disable"
						title="All websites"
					>
						<i className="fa fa-list-ul" />
						<span>Websites</span>
					</Link>
				</li>
			</ul>;

export default MainMenuComponent;
