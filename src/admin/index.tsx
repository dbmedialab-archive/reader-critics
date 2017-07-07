import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import './scss/admin.scss';

import {Routes} from 'admin/routes/Routes';
import {MainStore} from 'admin/stores/MainStore';

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
