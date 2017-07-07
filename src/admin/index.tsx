import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import './scss/admin.scss';

import TestLayout from 'admin/components/testpage/TestLayout';
import LoginLayout from 'admin/components/login/LoginLayout';
import {Routes} from 'admin/routes/Routes';
import {MainStore} from 'admin/stores/MainStore';

const apps = {
	'login': LoginLayout,
	'testpage': TestLayout,
};

const rootContainer : HTMLElement = document.getElementById('app');

if (!rootContainer.hasAttribute('name')) {
	throw new Error('Root <div> container must have a "name" attribute');
}
else {
	const name = rootContainer.getAttribute('name');

	if (typeof apps[name] === 'function') {
		ReactDOM.render(React.createElement(apps[name]), rootContainer);
	}
	else {
		throw new Error(`Unknown app type "${name}"`);
	}
}
class AppRouter extends React.Component<any,any>{
	render (){
		return (
			<BrowserRouter basename="/admin" >
				<Routes/>
			</BrowserRouter>
		);
	}
}
const rootContainer : HTMLElement = document.getElementById('admin');
ReactDOM.render(<Provider store={MainStore}><AppRouter/></Provider>, rootContainer);
