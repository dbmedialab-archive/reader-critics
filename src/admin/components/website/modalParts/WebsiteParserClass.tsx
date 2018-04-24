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

class WebsiteParserClass extends React.Component <any, any> {
	constructor (props) {
		super(props);
		this.onChange = this.onChange.bind(this);
	}

	onChange(e): void {
		return this.props.onChange({parserClass: e.target.value});
	}

	render () {
		const options = this.props.options.map((parser, index) => (
			<option value={parser} key={index + 1}>{parser}</option>
		));
		return (
			<div className="medium-6 columns">
				<fieldset className="text">
					<label htmlFor="parser">
						<b>Parser</b><br/>
						Which implementation to use when fetching articles
					</label>
					<select
						id="parser-class" className="small-12 large-12"
						value={this.props.parserClass}
						onChange={this.onChange}
						name="parserClass"
					>
						{!this.props.parserClass ?
							<option value="" disabled /> : null}
						{options}
					</select>
				</fieldset>
			</div>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	return {
		options: state.website.getIn(['options', 'parsers'], []),
		parserClass: state.website.getIn(['selected', 'parserClass'], ''),
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(WebsiteParserClass);
