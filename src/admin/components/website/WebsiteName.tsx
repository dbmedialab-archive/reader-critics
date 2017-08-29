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
import {InputError} from 'admin/components/form/InputError';
import {connect} from 'react-redux';
import * as WebsiteActions from 'admin/actions/WebsiteActions';

class WebsiteName extends React.Component <any, any> {
	constructor (props) {
		super(props);

		this.state = {
			value: '',
			touched: false,
		};

		this.onSubmit = this.onSubmit.bind(this);
		this.onKeyPress = this.onKeyPress.bind(this);
		this.onEdit = this.onEdit.bind(this);
		this.isInvalid = this.isInvalid.bind(this);
	}

	componentWillMount() {
		if (!this.props.websites.length) {
			WebsiteActions.getWebsiteList();
		}
	}

	onSubmit () {
		const {touched, value} = this.state;
		if (touched && value && !this.isInvalid()) {
			return this.props.onSubmit({
				name: this.state.value,
			});
		}
	}

	onKeyPress (e) {
		if (e.key === 'Enter') {
			return this.onSubmit();
		}
	}

	onEdit (e) {
		this.setState({
			value: e.target.value,
			touched: true,
		});
	}

	isInvalid() {
		let result = '';
		this.props.websites.forEach(site => {
			if (this.state.value === site.name) {
				result = 'No duplicates allowed';
			}
		});
		if (!result) {
			result = this.state.value.length < 4 ? 'Site name have to be longer than 4 symbols': '';
		}
		return result;
	}

	render () {
		return (this.props.ID) ?
			(<div className="row expanded name-section">
				<div className="small-12">
					<h2>{this.props.name}</h2>
				</div>
			</div>) : (
				<fieldset className="name-section">
					<label htmlFor="name">
						Name:
					</label>
					<input
							id="name" type="text" className="small-12 large-4"
							value={this.state.value}
							onChange={this.onEdit}
							onKeyPress={this.onKeyPress} onBlur={this.onSubmit}
					/>
					<InputError
						errorText={this.isInvalid()}
						touchedField={this.state.touched}
					/>
				</fieldset>);
	}
}

const mapStateToProps = (state, ownProps) => {
	return {
		name: state.website.getIn(['selected', 'name']) || '',
		ID: state.website.getIn(['selected', 'ID']) || null,
		websites: state.website.getIn(['websites']) || [],
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(WebsiteName);
