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

class SuggestionsListItemComponent extends React.Component <any, any> {
	constructor(props) {
		super(props);
		this.getTimeString = this.getTimeString.bind(this);
		this.toggleVisibility = this.toggleVisibility.bind(this);

		this.state = {
			visible: false,
		};
	}

	getTimeString(dateStr: string) : string {
		const dateTimeObj = new Date(dateStr);
		if (isNaN(dateTimeObj.getTime())) {
			return 'incorrect date';
		} else {
			return `${dateTimeObj.toLocaleDateString()} ${dateTimeObj.toLocaleTimeString()}`;
		}
	}

	toggleVisibility() {
		return this.setState({visible: !this.state.visible});
	}

	render(){
		const {
			comment,
			email,
			date: {
				created,
			},
			remote: {
				ipAddress,
				userAgent,
			},
		} = this.props.suggestion;
		const suggestionDateTime = this.getTimeString(created);
		return (
			<div className="suggestions-list-item">
				<div className="row expanded info-section">
					<div className="small-4  time-item">
						<i className="fa fa-clock-o"></i>
						{suggestionDateTime}
					</div>
					{email ?
					<div className="small-8  user-email">
						<i className="fa fa-envelope-open-o"></i>
						{email}
					</div> : null}
				</div>
				<div className="row expanded comment-section">
					<div className="small-12">
						{comment}
					</div>
				</div>
				<div className={`row expanded additional-info-section${this.state.visible ? ' opened' : ''}`}>
					<div className="small-12">
						<div className="additional-btn" onClick={this.toggleVisibility}>
							Additional User Info
						</div>
					</div>
					<div className="small-12 additional-content">
						<div className="additional-content-section">
							<div className="row">
								<div className="small-12 columns">
									<div className="user-ip-address">
										<p>
											<span className="title">IP-Address: </span>
											{ipAddress}
										</p>
									</div>
								</div>
							</div>
							<div className="row">
								<div className="small-12 columns">
									<div className="user-browser-user-agent">
										<p>
											<span className="title">User Agent: </span>
											{userAgent}
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default SuggestionsListItemComponent;
