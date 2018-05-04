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
import { InputError } from 'admin/components/form/InputError';
import { connect } from 'react-redux';
import Validator from 'admin/services/Validation';

class WebsiteFeedbackEmailOverride extends React.Component <any, any> {
	private readonly validator : Validator;

	constructor (props) {
		super(props);
		this.state = {
			value: '',
			touched: false,
		};

		this.validator = new Validator();

		this.onDelete = this.onDelete.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.onKeyPress = this.onKeyPress.bind(this);
		this.onEdit = this.onEdit.bind(this);
		this.checkValidation = this.checkValidation.bind(this);
	}

	checkValidation () {
		const {value} = this.state;
		const isEmail = this.validator.validate('feedbackEmailOverride', value, { required: true });

		if (isEmail.isError) {
			return isEmail.message;
		}
		else {
			const isUnique = this.validator.validate('uniqueness',
				this.props.feedbackEmailOverride.concat(value));

			if (isUnique.isError) {
				return isUnique.message;
			}

			return false;
		}
	}

	onDelete (index) {
		const {feedbackEmailOverride: override} = this.props;
		if (index >= 0) {
			const feedbackEmailOverride = override.asMutable();
			feedbackEmailOverride.splice(index, 1);
			return this.props.onChange({feedbackEmailOverride});
		}
	}

	onSubmit () {
		const {touched, value} = this.state;
		if (touched && value && !this.checkValidation()) {
			const feedbackEmailOverride = this.props.feedbackEmailOverride.concat(value);
			this.props.onChange({feedbackEmailOverride});
			return this.setState({value: '', touched: false});
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

	render () {
		const feedbackEmailOverride = this.props.feedbackEmailOverride.map((email, index) => {
			return (
				<li key={index + '-email-override'} className="website-feedback-email-override-list-item">
					{email}
					<i className="fa fa-times" onClick={this.onDelete.bind(this, index)}/>
				</li>);
		});
		return (
			<div className="medium-12 columns">
				<fieldset className="text">
					<label htmlFor="feedback-email-override">
						<b>Feedback email override</b><br/>
						Emails to get notifications about feedbacks for articles if needed
						(instead of article authors emails)
					</label>
					<input
						id="feedback-email-override" type="text" className="small-12 medium-12"
						value={this.state.value}
						onChange={this.onEdit}
						onKeyPress={this.onKeyPress} onBlur={this.onSubmit}
					/>
					<InputError
						errorText={this.checkValidation()}
						touchedField={this.state.touched}
					/>
					<ul className="website-feedback-email-override-list">
						{feedbackEmailOverride}
					</ul>
				</fieldset>
			</div>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	return {
		feedbackEmailOverride: state.website.getIn(['selected', 'feedbackEmailOverride'], null),
		ID: state.website.getIn(['selected', 'ID'], null),
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(WebsiteFeedbackEmailOverride);
