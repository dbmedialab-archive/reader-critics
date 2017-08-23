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
import WebsiteHosts from 'admin/components/website/WebsiteHosts';
import WebsiteEditors from 'admin/components/website/WebsiteEditors';

class WebsiteComponent extends React.Component <any, any> {
	constructor (props) {
		super(props);

		this.state = {
			isEditingParser: false,
			isEditingSCSS: false,
			isEditingFeedbackTemplate: false,
			input: {
				scssVariables: {
					touched: false,
					value: '',
				},
			},
		};

		this.onSubmit = this.onSubmit.bind(this);
		this.onEditClick = this.onEditClick.bind(this);
		this.onEditParser = this.onEditParser.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(data) {
		return this.props.onSubmit(data);
	}
	onSubmit (e) {
		e.preventDefault();
	}

	onEditClick (param) {
		return this.setState({['isEditing' + param]: !this.state['isEditing' + param]});
	}

	onEditParser () {
		return this.props.userRole === UserRole.SystemAdmin ? this.onEditClick('Parser') : false;
	}

	render () {
		return (
			<div className="website-item">
				<div className="row expanded time-section">
					<div className="small-12  time-item">
						<i className="fa fa-clock-o"/> Since: {new Date(this.props.date).toDateString()}
					</div>
				</div>
				<div className="row expanded name-section">
					<div className="small-12">
						<h2>{this.props.name}</h2>
					</div>
				</div>

				<form onSubmit={this.onSubmit} className="website-edition-form">
					<WebsiteHosts onSubmit={this.handleSubmit}/>
					<WebsiteEditors onSubmit={this.handleSubmit}/>
					<fieldset className="website-parser">
						<label htmlFor="parser-class">
							Parser:
							{this.props.userRole === UserRole.SystemAdmin ? (
								<a onClick={this.onEditParser} className="button default" href="#">
									{this.state.isEditingParser ? 'Hide' : 'Edit'}
								</a>) : null
							}
						</label>
						{
							this.state.isEditingParser ? (<input
								id="parser-class" type="text" className="small-12 large-4"
								defaultValue={this.props.parserClass}
							/>) : (
								<div className="small-12">
									<div className="website-parser-class">
										{this.props.parserClass || 'Not set'}
									</div>
								</div>
							)
						}
					</fieldset>
					<fieldset className="website-scss">
						<label htmlFor="scss-variables">SCSS variables:</label>
						<span>Coming soon</span>
					</fieldset>
					<fieldset className="website-templates">
						<label htmlFor="feedback-page">Feedback Page Template:</label>
						<span>Coming soon</span>
					</fieldset>
				</form>
			</div>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	return {
		name: state.website.getIn(['selected', 'name']) || '',
		date: state.website.getIn(['selected', 'date', 'created']) || '',
		ID: state.website.getIn(['selected', 'ID']) || '',
		parserClass: state.website.getIn(['selected', 'parserClass']) || '',
		scssVariables: state.website.getIn(['selected', 'layout', 'scssVariables']) || '',
		feedbackPage: state.website.getIn(['selected', 'layout', 'templates', 'feedbackPage']) || '',
		userRole: state.user.getIn(['role']),
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(WebsiteComponent);
