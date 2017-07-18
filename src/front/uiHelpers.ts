import * as React from 'react';
import * as ReactDOM from 'react-dom';
import ModalWindow from 'front/component/ModalWindow';

export function showError(msg?, callback?) {
	const errContainer : HTMLElement = document.getElementById('err-section');
	const props = {
		msg: msg || '',
		callback: callback || null,
	};
	const errModal = React.createElement(ModalWindow, props);
	ReactDOM.render(errModal, errContainer);
}
