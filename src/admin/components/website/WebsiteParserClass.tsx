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
import UserRole from 'base/UserRole';

class WebsiteParserClass extends React.Component <any, any> {
	constructor (props) {
		super(props);

		this.state = {
			editMode: false,
		};

		this.onToggleEdit = this.onToggleEdit.bind(this);
		this.onChange = this.onChange.bind(this);
		this.checkRole = this.checkRole.bind(this);
		this.isEditing = this.isEditing.bind(this);
	}

	onToggleEdit () {
		return this.checkRole() ? this.setState({editMode: !this.state.editMode}) : false;
	}

	private checkRole () {
		return this.props.userRole === UserRole.SystemAdmin;
	}
	onChange (e) {
		const parserClass = e.target.value;
		if (this.checkRole() && parserClass) {
			return this.props.onSubmit({parserClass});
		}
	}

	isEditing() {
		return this.state.editMode || !this.props.ID;
	}
	render () {
		const options = this.props.options.map((parser, index) => (
			<option value={parser} key={index + 1}>{parser}</option>
		));
		return (
			<fieldset className="website-parser">
				<label htmlFor="parser-class">
					Parser:
					{this.checkRole() && this.props.ID ? (
						<a onClick={this.onToggleEdit} className="button default" href="#">
							{this.state.editMode ? 'Hide' : 'Edit'}
						</a>) : null
					}
				</label>
				{
					this.isEditing() ? (
						<select
							id="parser-class" className="small-12 large-4"
							value={this.props.parserClass}
							onChange={this.onChange}
						>
							{!this.props.parserClass ?
							<option value="" disabled /> : null}
							{options}
						</select>
						) : (
						<div className="small-12">
							<div className="website-parser-class">
								{this.props.parserClass || 'Not set'}
							</div>
						</div>
					)
				}
			</fieldset>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	return {
		parserClass: state.website.getIn(['selected', 'parserClass']) || '',
		userRole: state.user.getIn(['role']),
		options: state.website.getIn(['options', 'parsers']) || [],
		ID: state.website.getIn(['selected', 'ID']) || null,
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(WebsiteParserClass);
