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
import {connect} from 'react-redux';
import WebsiteHosts from 'admin/components/website/WebsiteHosts';
import WebsiteEditors from 'admin/components/website/WebsiteEditors';
import WebsiteParserClass from 'admin/components/website/WebsiteParserClass';
import WebsiteLayoutSection from 'admin/components/website/WebsiteLayoutSection';
import WebsiteName from 'admin/components/website/WebsiteName';

class WebsiteComponent extends React.Component <any, any> {
	constructor (props) {
		super(props);

		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(data) {
		return this.props.onSubmit(data);
	}

	render () {
		return (
			<div className="website-item">
				{this.props.ID ?
				<div className="row expanded time-section">
					<div className="small-12  time-item">
						<i className="fa fa-clock-o"/> Since: {new Date(this.props.date).toDateString()}
					</div>
				</div> : null}

				<form onSubmit={(e) => e.preventDefault()} className="website-edition-form">
					<WebsiteName onSubmit={this.handleSubmit}/>
					<WebsiteHosts onSubmit={this.handleSubmit}/>
					<WebsiteEditors onSubmit={this.handleSubmit}/>
					<WebsiteParserClass onSubmit={this.handleSubmit}/>
					<WebsiteLayoutSection onSubmit={this.handleSubmit}/>
				</form>
			</div>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	return {
		date: state.website.getIn(['selected', 'date', 'created']) || '',
		ID: state.website.getIn(['selected', 'ID']) || '',
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(WebsiteComponent);
