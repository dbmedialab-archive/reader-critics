import * as React from 'react';
import * as ReactDOM from 'react-dom';
import ModalWindow from 'front/component/ModalWindow';

function renderModal (props) : void {
	const modalContainer : HTMLElement = document.getElementById('modal-section');
	const modalWindow = React.createElement(ModalWindow, props);
	ReactDOM.render(modalWindow, modalContainer);
}

export function showError(msg?, callback?) : void {
	const props = {
		msg: msg || '',
		callback: callback || null,
		success: false,
	};
	renderModal(props);
}

export function showSuccess(msg?, callback?): void {
	const props = {
		success: true,
		msg: msg || '',
		callback: callback || null,
	};
	renderModal(props);
}
