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

// Common components
import  * as UIActions from 'admin/actions/UIActions';
import AdminConstants from 'admin/constants/AdminConstants';

import Layout from 'admin/components/layout/LayoutComponent';
import AddUserModalComponent from 'admin/components/modal/AddUserModalComponent';
import PromptModalComponent from 'admin/components/modal/PromptModalComponent';
import DialogModalComponent from 'admin/components/modal/DialogModalComponent';

class Users extends React.Component <any, any> {
	constructor(props) {
		super(props);
		this.showModal = this.showModal.bind(this);
		this.showPreloader = this.showPreloader.bind(this);
	}
	showModal(): void{
		const options = {
			isOpen: true,
		};
		const windowName = AdminConstants.TEST_MODAL_WINDOW;
		UIActions.modalWindowsChangeState(windowName, options);
	}
	showDialog(): void{
		UIActions.showDialog({
			noBtnName: 'I dont know',
			yesBtnName:'Yes, its dialog',
			dialogTitle: 'This is a dialog, isnt it?',
			yesHandler: (() => {
				alert('Excelent answer');
			}),
		});
	}
	showPrompt(): void{
		UIActions.showPrompt({
			okHandler: ((value)=>{
				alert('You entered '+value);
			}),
		});
	}
	showPreloader(): void{
			UIActions.showMainPreloader();
			setTimeout(UIActions.hideMainPreloader, 2000);
	}
	render(){
		return (<Layout>
			Users page<br/>
			<div className="button success small" onClick={this.showModal}>Show modal</div>
			<div className="button success small" onClick={this.showDialog}>Show dialog</div>
			<div className="button success small" onClick={this.showPrompt}>Show prompt</div>
			<br/>
			<br/>

			<div className="button success small" onClick={this.showPreloader}>Show preloader</div>
			<AddUserModalComponent windowName={AdminConstants.TEST_MODAL_WINDOW} />
			<PromptModalComponent windowName={AdminConstants.PROMPT_MODAL_WINDOW} />
			<DialogModalComponent windowName={AdminConstants.DIALOG_MODAL_WINDOW} />
		</Layout>);
	}
}
export default Users;
