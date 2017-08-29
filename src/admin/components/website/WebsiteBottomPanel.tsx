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

class WebsiteBottomPanel extends React.Component <any, any> {
	constructor (props) {
		super(props);

		this.onSubmit = this.onSubmit.bind(this);
	}

	onSubmit () {
		return this.props.onSubmit();
	}

	render () {
		return (!this.props.ID ?
			<div className="row expanded  website-bottom-panel">
				<div className="small-12">
					<button type="submit" className="button success large" onClick={this.onSubmit}>Save</button>
				</div>
			</div> : null
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	return {
		ID: state.website.getIn(['selected', 'ID']) || null,
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(WebsiteBottomPanel);
