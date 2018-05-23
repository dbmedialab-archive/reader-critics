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
import {LabeledInput} from 'admin/components/website/additionalComponents/LabeledInput';
import {connect} from 'react-redux';
import Validator from 'admin/services/Validation';

class WebsiteName extends React.Component <any, any> {
	private readonly validator : Validator;

	constructor (props) {
		super(props);
		this.state = {
			value: this.props.name,
			touched: false,
		};
		this.validator = new Validator();
		this.onChange = this.onChange.bind(this);
		this.onKeyPress = this.onKeyPress.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.isError = this.isError.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			value: nextProps.name,
			touched: false,
		});
	}

	onChange(e) {
		this.setState({
			value: e.target.value,
			touched: true,
		});
	}

	onKeyPress(e): void {
		if (e.key === 'Enter') {
			return this.onSubmit();
		}
	}

	onSubmit() {
		if (!this.isError() && this.state.value !== this.props.name) {
			return this.props.onSubmit({name: this.state.value});
		}
	}

	isError (): string {
		let websites = this.props.websites.asMutable();
		websites = websites.filter(website => {
			return (website.ID !== this.props.ID);
		}).map(website => {
			return website.name;
		});
		websites.push(this.state.value);
		const lengthValidation = this.validator.validate('websiteName',
			this.state.value, {required: true});
		const uniquenessValidation = this.validator.validate('uniqueness',
			websites, {required: true});
		return uniquenessValidation.message || lengthValidation.message;
	}

	render () {
		const {value, touched} = this.state;
		return (
			<div className="medium-6 small-12 columns">
			<fieldset className="text">
				<LabeledInput
					onSubmit={this.onSubmit} errorText={this.isError()}
					onEdit={this.onChange} value={value} touched={touched}
					label={<span>
							<b>Website Name</b><br/>
							Usually the main host name (must be unique systemwide)
						</span>}
					ID={`name`}
				/>
			</fieldset>
		</div>);
	}
}

const mapStateToProps = (state, ownProps) => {
	return {
		websites: state.website.getIn(['websites'], []),
		ID: state.website.getIn(['selected', 'ID'], null),
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(WebsiteName);
