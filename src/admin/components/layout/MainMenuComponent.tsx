import * as React from 'react';

import { Link } from 'react-router-dom';

const MainMenuComponent : React.StatelessComponent <any> = () =>
		<ul className="menu-nav">
				<li className="menu-item">
					<Link
							to="/users"
							className="tooltip-tip tooltipster-disable"
							title="All comics"
						>
							<i className="fa fa-list-ul" />
							<span>Users</span>
					</Link>
				</li>
			</ul>;

export default MainMenuComponent;
