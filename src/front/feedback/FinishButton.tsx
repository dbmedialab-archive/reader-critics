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

export interface FinishButtonProps {
	SendForm? : Function;
	HideMessage? : Function,
	message? : string;
	appear? : boolean,
	close? : boolean;
}

const FinishButton : React.StatelessComponent <FinishButtonProps> = (props) => {
	const css = classnames('fab', {
		enabled: props.appear && !props.close,
	});

	return <div className={css}>
		{ props.message ? <span onClick={() => props.HideMessage}>{props.message}</span> : null }
		<a onClick={() => { props.SendForm(); }}>Send skjema</a>
	</div>;
};

FinishButton.defaultProps = {
	SendForm: () => alert('Send feedback!'),
	HideMessage: () => null,
	message: 'Klikk her når du er ferdig med skjemaet.',
	appear: false,
	close: false,
};

export default FinishButton;
