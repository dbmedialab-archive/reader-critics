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

export default class WebsiteLayout extends React.Component <any, any> {
	constructor (props) {
		super(props);
		this.state = {
			visible: false,
			value: this.props.feedbackPage,
		};

		this.onSubmit = this.onSubmit.bind(this);
		this.toggleVisibility = this.toggleVisibility.bind(this);
		this.onChange = this.onChange.bind(this);
	}

	componentWillReceiveProps (nextProps) {
		this.setState({
			value: nextProps.feedbackPage,
		});
	}

	onChange (e) {
		this.setState({
			value: e.target.value,
		});
	}

	onSubmit () {
		if (this.state.value !== this.props.feedbackPage) {
			return this.props.onSubmit(
				{
					layout: {
						templates: {
							feedbackPage: this.state.value,
						},
					},
				});
		}
	}

	toggleVisibility () {
		this.setState({visible: !this.state.visible});
	}

	render () {
		const className = `row additional-settings-section
							${this.state.visible ? ' opened' : ''}`;
		return (
			<div className={className}>
				<div className="small-12 columns">
					<div className="additional-btn" onClick={this.toggleVisibility}>
						Layout Settings
					</div>
				</div>
				<div className="small-12 columns additional-content">
					<div className="additional-content-section">
						<div className="row">
							<div className="small-12 columns">
								<fieldset className="text">
									<label htmlFor="feedbackPage">Feedback Page</label>
									<textarea
										value={this.state.value || ''}
										onChange={this.onChange}
										name="feedbackPage"
										onBlur={this.onSubmit}
										rows={10}
									/>
								</fieldset>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
