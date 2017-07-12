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

class TopbarComponent extends React.Component <any, any>{
	render(){
		const userName = this.props.currentUser.name;
		let submenuClass = 'top-bar-left show-for-small-only';
		submenuClass += (this.props.isSubmenuOpen)?' open':'';
		let accountMenuClass:string = 'has-dropdown bg-white';
		accountMenuClass += (this.props.isAccountMenuOpen)?' open':'';
		return(
			<div className="top-bar-nest">
				<nav className="top-bar" role="navigation">
					<div className="top-bar-title show-for-small-only">
						<button className="fa fa-bars" type="button" >
						</button>
					</div>
					<div className={submenuClass}>
						<MainMenuComponent role ={this.props.currentUser.role}/>
					</div>
					<section className="top-bar-section ">
						<ul className="right">
							<li className={accountMenuClass}>
								<a className="bg-white" href="#">
									<img alt="" className="admin-pic img-circle" src="/static/admin/images/no_avatar.jpg"/>
									<span className="admin-pic-text text-gray">{userName}</span>
								</a>
								<ul
									className="dropdown dropdown-nest profile-dropdown"
								>
									<li>
										<i className="fa fa-sign-out"></i>
										<a href="/logout">
											<h4>
												Logout
											</h4>
										</a>
									</li>
								</ul>
							</li>
						</ul>
					</section>
				</nav>
			</div>
		)
	}
};

export default TopbarComponent;
