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
import Modal from 'react-modal';

const customStyles = {
	content: {
		left: '50%',
		right: 'auto',
		bottom: 'auto',
		marginRight: '-50%',
		border: 'none',
		WebkitTransform: 'translate(-50%, 0px)',
		MsTransform: 'translate(-50%, 0px)',
		MozTransform: 'translate(-50%, 0px)',
		OTransform: 'translate(-50%, 0px)',
		transform: 'translate(-50%, 0px)',
		background: 'none',
		overflow: 'visible',
	},
	overlay: {
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		zIndex: 101,
		overflowY: 'auto',
	},
};

export default class ReactModal extends React.Component <any, any> {
	constructor(props) {
		super(props);
		this.closeModal = this.closeModal.bind(this);
	}

	closeModal() {
		this.props.closeHandler();
	}
	render() : JSX.Element {
		const content = this.props.children;
		return (
			<div>
				<Modal
					isOpen={this.props.isOpen}
					onRequestClose={this.closeModal}
					shouldCloseOnOverlayClick
					style={customStyles}
					contentLabel="Example Modal"
				>
					{content}
				</Modal>
			</div>
		);
	}
}
