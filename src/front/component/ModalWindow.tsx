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

// tslint:disable max-file-line-count

import * as React from 'react';

/*export interface IModalWindow {
	message : number;
	okHandler : Function;
}*/
export type StyleMap = any;

export type Style = StyleMap;

export interface StyledComponentProps {
  style?: Style;
}

const styles = {
	'modalWrapper': {
		position: 'absolute' as 'absolute',
		top: '40px',
		left: '50%',
		right: 'auto',
		bottom: 'auto',
		border: 'none',
		background: 'none',
		overflow: 'visible' as 'visible',
		borderRadius: '4px',
		outline: 'none',
		padding: '20px',
		marginRight: '-50%',
		transform: 'translate(-50%, 0px)',
	}
}
class ModalWindow extends React.Component <any, any> {
	constructor(props) {
		super(props);
	}
	public render() {
		return (
			<div className="modal-wrapper" style={styles.modalWrapper}>
				<div className="modal">
				asdasda
				</div>	
			</div>
		)
	}
}

export default ModalWindow;
