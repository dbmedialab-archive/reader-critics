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
import {InputError} from 'admin/components/form/InputError';

export const isHostName =
	(s: string): boolean => {
		const pattern = new RegExp(
			`^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\\-]*[a-zA-Z0-9])\\.)*
			([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\\-]*[A-Za-z0-9])$`, 'i');
		return pattern.test(s);
	}; //TODO replace it to separate place

class WebsiteComponent extends React.Component <any, any> {
	constructor (props) {
		super(props);

		this.state = {
			isEditingChiefs: false,
			isEditingHosts: false,
			isEditingParser: false,
			isEditingSCSS: false,
			isEditingFeedbackTemplate: false,
			input: {
				host: {
					touched: false,
					value: '',
				},
				scssVariables: {
					touched: false,
					value: '',
				},
			},
		};

		this.onSubmit = this.onSubmit.bind(this);
		this.onEditClick = this.onEditClick.bind(this);
		this.onEditChiefs = this.onEditChiefs.bind(this);
		this.onEditHosts = this.onEditHosts.bind(this);
		this.onEditParser = this.onEditParser.bind(this);
		this.onHostDelete = this.onHostDelete.bind(this);
		this.onChiefDelete = this.onChiefDelete.bind(this);
		this.onHostAdd = this.onHostAdd.bind(this);
		this.onEditHosts = this.onEditHost.bind(this);
	}

	onSubmit (e) {
		e.preventDefault();
		return this; //TODO make api request
	}

	checkDuplicateLink (link) {
		let result: string = '';
		if (this.state.isEditingHost && isHostName(link)) {
			this.props.hosts.forEach((existLink) => {
				if (existLink.toLowerCase() === link.toLowerCase()) {
					result = 'Duplicates are not allowed';
				}
			});
			return result;
		} else {
			return 'URL is not valid';
		}
	}

	onEditClick(param) {
		return this.setState({['isEditing' + param]: !this.state['isEditing' + param]});
	}

	onEditChiefs() {
		return this.onEditClick('Chiefs');
	}

	onEditHosts() {
		return this.onEditClick('Hosts');
	}

	onEditParser() {
		return this.props.userRole === UserRole.SystemAdmin ?
				this.onEditClick('Parser') : false;
	}

	onHostDelete() {
		console.log('delete');
		return;
	}

	onChiefDelete() {
		console.log('delete');
		return;
	}

	onHostAdd() {
		const {touched, value} = this.props.input.host;
		if (touched && value && !this.checkDuplicateLink(value)) {
			console.log('can be submited');
		}
	}

	onEditHost(value) {
		this.setState({
			input: {
				host: {
					value,
					touched: true,
				},
			},
		});
	}

	render () {
		const hosts = this.props.hosts.map((host, index) => {
			return (<li key={index + 'host'} className="website-host-list">
				{host}
				{this.state.isEditingHosts ? <i className="fa fa-times" onClick={this.onHostDelete}/> : null}
				</li>);
		});
		const chiefs = this.props.chiefEditors.map((chief, index) => {
			return (<li key={index + 'editor'} className="website-editor-list">
					{chief.name}
					{this.state.isEditingChiefs ?
						<i className="fa fa-times"  onClick={this.onChiefDelete}/> : null}
					</li>);
		});
		const users = this.props.users.filter(
				(user) => {
					let pass = true;
					this.props.chiefEditors.forEach((editor) => {
						if (editor.email === user.email) {
							pass = false;
						}
					});
					return pass;
				})
			.map(
				(user) => (
					<option value={user.id}>{user.name}</option>
				));
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
					<fieldset className="chief-editors">
						<label htmlFor="chief-editor">
							Chief Editors:
							<a onClick={this.onEditChiefs} className="button default" href="#">
								{this.state.isEditingChiefs ? 'Hide' : 'Edit'}
							</a>
						</label>
						<ul>
							{chiefs}
						</ul>
						{this.state.isEditingChiefs ?
						(<select
							id="chief-editor" className="chief-editor small-12 large-4"
							onSelect={this.onSubmit} onBlur={this.onSubmit} >
							{users}
						</select>) : null
						}
					</fieldset>
					<fieldset className="hosts">
						<label htmlFor="hosts-link">
							Hosts:
							<a onClick={this.onEditHosts} className="button default" href="#">
								{this.state.isEditingHosts ? 'Hide' : 'Edit'}
							</a>
						</label>
						<ul>
							{hosts}
						</ul>
						{this.state.isEditingHosts ?
						(<input
							id="hosts-link" type="text" className="small-12 large-4"
							value={this.state.input.host.value} onChange={this.onEditHost}
							onSubmit={this.onHostAdd} onBlur={this.onHostAdd}
						/>
						) : null
						}
						<InputError
							errorText={this.checkDuplicateLink(this.state.input.host.value)}
							touchedField={this.state.input.host.touched}
						/>
					</fieldset>
					<fieldset className="website-parser">
						<label htmlFor="parser-class">
							Parser:
							{this.props.userRole === UserRole.SystemAdmin ?
								(<a onClick={this.onEditParser} className="button default" href="#">
									{this.state.isEditingParser ? 'Hide' : 'Edit'}
								</a>) : null
							}
						</label>
						{
							this.state.isEditingParser ?
							(<input
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
		chiefEditors: state.website.getIn(['selected', 'chiefEditors']) || [],
		hosts: state.website.getIn(['selected', 'hosts']) || [],
		parserClass: state.website.getIn(['selected', 'parserClass']) || '',
		scssVariables: state.website.getIn(['selected', 'layout', 'scssVariables']) || '',
		feedbackPage: state.website.getIn(['selected', 'layout', 'templates', 'feedbackPage']) || '',
		users: state.users || [],
		userRole: state.user.getIn(['role']),
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(WebsiteComponent);
