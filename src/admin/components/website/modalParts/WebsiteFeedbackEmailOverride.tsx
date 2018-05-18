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
import { connect } from 'react-redux';
import Validator from 'admin/services/Validation';
import {LabeledInput} from '../additionalComponents/LabeledInput';
import {SwitchBox} from '../additionalComponents/SwitchBox';

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
		this.onToggleCheck = this.onToggleCheck.bind(this);
		this.sendOverrideChanges = this.sendOverrideChanges.bind(this);
		this.buildList = this.buildList.bind(this);
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

	sendOverrideChanges (data) {
		const {overrideSettings: os} = this.props;
		const overrideSettings = Object.assign({}, os, data);
		return this.props.onChange({overrideSettings});
	}

	onDelete (index: number) {
		const {feedbackEmailOverride: override} = this.props;
		if (index >= 0) {
			const feedbackEmail = override.asMutable();
			feedbackEmail.splice(index, 1);
			return this.sendOverrideChanges({overrides: {feedbackEmail}});
		}
	}

	onSubmit () {
		const {touched, value} = this.state;
		if (touched && value && !this.checkValidation()) {
			const overrides = {feedbackEmail: this.props.feedbackEmailOverride.concat(value)};
			this.sendOverrideChanges({overrides});
			return this.setState({value: '', touched: false});
		}
	}

	onToggleCheck (e) {
		const {checked} = e.target;
		const settings = {feedback: checked};
		return this.sendOverrideChanges({settings});
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

	buildList () {
		return this.props.feedbackEmailOverride.map((email, index) => (
				<li key={index + '-email-override'} className="website-feedback-email-override-list-item">
					{email}
					<i className="fa fa-times" onClick={this.onDelete.bind(this, index)}/>
				</li>));
	}

	render () {
		const {value, touched} = this.state;
		const {settings: {feedback: feedbackOverrideStatus = false}} = this.props;
		return (
			<div className="medium-12 columns website-feedback-email-override-container overrides-container">
				<fieldset className="text">
					<div className="row">
						<div className="small-12 columns hide-for-medium columns override-status-control">
							<SwitchBox
								classes={`switch round tiny`} ID={'feedback-email-override-status-small'}
								checked={feedbackOverrideStatus} onChange={this.onToggleCheck}
							/>
						</div>
						<div className="small-12 medium-9 large-10 columns">
							<LabeledInput
								onSubmit={this.onSubmit} errorText={this.checkValidation()}
								onEdit={this.onEdit} value={value}	touched={touched}
								label={<span>
										<b>Feedback email override</b><br/>
										Emails to get notifications about feedbacks for articles if needed
										(instead of article authors emails)
									</span>}
								ID={`feedback-email-override`}/>
						</div>
						<div className="medium-3 large-2 show-for-medium columns override-status-control">
							<SwitchBox
								classes={`switch round large`} ID={'feedback-email-override-status'}
								checked={feedbackOverrideStatus} onChange={this.onToggleCheck}
							/>
						</div>
						<div className="small-12 columns">
							<ul className="website-feedback-email-override-list">
								{this.buildList()}
							</ul>
						</div>
					</div>
				</fieldset>
			</div>);
	}
}

const mapStateToProps = (state, ownProps) => {
	return {
		feedbackEmailOverride: state.website.getIn(
			['selected', 'overrideSettings', 'overrides', 'feedbackEmail'], []),
		overrideSettings: state.website.getIn(
			['selected', 'overrideSettings'], {}),
		settings: state.website.getIn(
			['selected', 'overrideSettings', 'settings'], {}),
		ID: state.website.getIn(['selected', 'ID'], null),
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(WebsiteFeedbackEmailOverride);
