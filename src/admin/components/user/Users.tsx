import * as React from 'react';
import 'front/scss/app.scss';

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
