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
import * as classnames from 'classnames';
import { FormattedMessage } from 'react-intl';

export interface FinishButtonProps {
	SendForm? : Function;
	HideMessage? : Function,
	message? : JSX.Element;
	enabled? : boolean,
}

export default class FinishButton extends React.Component <FinishButtonProps, any> {
	public static defaultProps: Partial <FinishButtonProps> = {
		SendForm: () => alert(<FormattedMessage id="fb.sendForm.alertMessage"/>),
		HideMessage: () => null,
		message: <FormattedMessage id="fb.sendForm.message"/>,
	};

	constructor(props : FinishButtonProps) {
		super(props);
		this.state = {
			enabled: false,
			message: this.props.message,
		};
	}

	public disable(message : JSX.Element) {
		this.setState({
			enabled: false,
			message,
		});
	}

	public enable(message : JSX.Element) {
		this.setState({
			enabled: true,
			message,
		});
	}

	public render() {
		const css = classnames('fab', {
			enabled: this.state.enabled,
			disabled: !this.state.enabled,
		});

		return <div className={css}>
			<span id="message" onClick={() => this.props.HideMessage}>
				{this.state.message}
			</span>
			<a onClick={() => this.props.SendForm()}>
				<FormattedMessage id="button.sendForm"/>
			</a>
		</div>;
	}
}
