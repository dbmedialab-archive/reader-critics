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
import {LabeledInput} from 'admin/components/website/additionalComponents/LabeledInput';
import Validator from 'admin/services/Validation';

class WebsiteEscalateThreshold extends React.Component <any, any> {
	private readonly validator : Validator;

	constructor (props) {
		super(props);
		this.state = {
			value: props.escalateThreshold || 0,
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
			value: nextProps.escalateThreshold,
			touched: false,
		});
	}

	onChange(e) {
		this.setState({
			value: parseInt(e.target.value),
			touched: true,
		});
	}

	onKeyPress(e): void {
		if (e.key === 'Enter') {
			return this.onSubmit();
		}
	}

	onSubmit() {
		const escalateThreshold = {};
		if (!this.isError() && this.state.value !== this.props.escalateThreshold){
			escalateThreshold['toEditor'] = this.state.value;
			return this.props.onSubmit({escalateThreshold});
		}
	}

	isError (): string {
		const valueValidation = this.validator.validate('escalateNumber',
			this.state.value, {required: false});
			return valueValidation.message;
	}

	render () {
		const {value, touched} = this.state;
		return (
			<div className="medium-6 small-12 columns">
				<fieldset className="text">
					<LabeledInput
						inputType="number"
						min="0"
						max="10"
						onSubmit={this.onSubmit} errorText={this.isError()}
						onEdit={this.onChange} value={value} touched={touched}
						label={<span>
							<b>Escalate Threshold override</b><br/>
							Set the number of feedback emails to get escalation notifications
						</span>}
						ID={`escalate-number`}
					/>
				</fieldset>
			</div>);
	}
}

const mapStateToProps = (state, ownProps) => {
	return {
		escalateThreshold: state.website.getIn(['selected', 'escalateThreshold', 'toEditor']),
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(WebsiteEscalateThreshold);
