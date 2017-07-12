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

