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

export interface IWebsiteLayoutContentSectionProps {
	value: string;
	buttonText: string;
	templateName: string;
	onSubmit: (object: object) => void;
	onChange: (value: string) => void;
	rows?: number;
}

export default class WebsiteLayoutContentSection
	extends	React.Component <IWebsiteLayoutContentSectionProps, any> {
	constructor (props: IWebsiteLayoutContentSectionProps) {
		super(props);
		this.state = {
			visible: false,
		};

		this.toggleVisibility = this.toggleVisibility.bind(this);
		this.onChange = this.onChange.bind(this);
	}

	onChange (e) {
		return this.props.onChange(e.target.value);
	}

	toggleVisibility () {
		const {visible} = this.state;
		this.setState({visible: !visible});
	}

	render () {
		const {buttonText, rows = 10, templateName, value = ''} = this.props;
		const {visible} = this.state;
		const className = `row layout-content-section
							${visible ? ' opened' : ''}`;
		return (
			<div className={className}>
				<div className="small-12 columns">
					<div className="layout-content-btn" onClick={this.toggleVisibility}>
						{buttonText}
					</div>
				</div>
				<div className="small-12 columns">
					<fieldset className="fieldset">
						<textarea
							value={value || ''}
							onChange={this.onChange}
							name={templateName}
							onBlur={this.props.onSubmit}
							rows={rows}
						/>
					</fieldset>
				</div>
			</div>
		);
	}
}
