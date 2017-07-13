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

//Independent modal module
import * as React from 'react';
import * as ReactDOM from 'react-dom';

const styles = {
	modalWrapper: {
		position: 'absolute' as 'absolute',
		top: '100px',
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
	},
	modalOverlay : {
		position: 'fixed' as 'fixed',
		top: '0px',
		left: '0px',
		right: '0px',
		bottom: '0px',
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		zIndex: 101,
		overflowY: 'auto' as 'auto',
	},
	modal : {
		background: '#fff',
		borderRadius: '3px',
		border: 'none',
		outline: 'none',
		padding: '20px 40px 20px',
		boxShadow: '0 1px 0 rgba(0, 0, 0, 0.2)',
		width: '500px',
	},
	iconSection:{
		textAlign: 'center',
		marginBottom: '40px',
	},
	content:{
		textAlign: 'center',
		color: '#777777',
	},
	buttonsSection:{
		width: '100%',
		textAlign: 'center',
		marginTop: '40px',
	},
};
export interface IAlertIcon {
	color?: string;
	width?: string;
	height?: string;
}
export interface IModalWindowProps {
	msg: string;
	callback?: Function;
}

const AlertIcon : React.StatelessComponent <IAlertIcon> = (props : IAlertIcon) => {
	const color = props.color || '#f44336',
		width = props.width || '56px',
		height = props.height || '56px';
	// tslint:disable-next-line
	return (<svg height={height} version="1.1" viewBox="0 0 16 16" width={width} xmlns="http://www.w3.org/2000/svg"><title/><defs/><g fill="none" fillRule="evenodd" id="Icons with numbers" stroke="none" strokeWidth="1"><g fill={color} id="Group" transform="translate(-96.000000, -432.000000)"><path d="M103,443 L103,445 L105,445 L105,443 Z M104,448 C99.5817218,448 96,444.418278 96,440 C96,435.581722 99.5817218,432 104,432 C108.418278,432 112,435.581722 112,440 C112,444.418278 108.418278,448 104,448 Z M103,435 L103,442 L105,442 L105,435 Z M103,435" id="Oval 208 copy"/></g></g></svg>);
};

class ModalWindow extends React.Component <IModalWindowProps, null> {
	constructor(props){
		super(props);
		this.hideModal = this.hideModal.bind(this);
		this.okBtnClick = this.okBtnClick.bind(this);

	}
	okBtnClick(evt) : void {
		if (this.props.callback) {
			this.props.callback();
		}
		this.hideModal();
	}
	hideModal(){
		ReactDOM.unmountComponentAtNode(document.getElementById('err-section'));
	}
	render(){
		const errMsg = this.props.msg || 'An error occured, please try again later';
		return(
			<div className="modal-overlay" style={styles.modalOverlay}>
				<div className="modal-wrapper" style={styles.modalWrapper}>
					<div className="modal" style={styles.modal}>
						<div className="icon-section" style={styles.iconSection}>
							<AlertIcon />
						</div>
						<div className="content" style={styles.content}>
							{errMsg}
						</div>
						<div className="buttonsSection" style={styles.buttonsSection}>
							<button
								type="submit"
								className="button button-primary"
								onClick={this.okBtnClick}>
									Lagre
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
export default ModalWindow;
