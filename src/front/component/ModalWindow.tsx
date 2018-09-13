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
import * as ReactDOM from 'react-dom';
import { FormattedMessage } from 'react-intl';
import { IntlProvider } from 'react-intl';
import {AlertIcon, SuccessIcon} from 'front/common/Icons';

/** @type {{styles: React.CSSProperties}} */
//const styles = { //TODO test
	const modalWrapper : React.CSSProperties = {
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
	modalOverlay : React.CSSProperties = {
		position: 'fixed' as 'fixed',
		top: '0px',
		left: '0px',
		right: '0px',
		bottom: '0px',
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		zIndex: 101,
		overflowY: 'auto' as 'auto',
	},
	modal : React.CSSProperties = {
		background: '#fff',
		borderRadius: '3px',
		border: 'none',
		outline: 'none',
		padding: '20px 40px 20px',
		boxShadow: '0 1px 0 rgba(0, 0, 0, 0.2)',
		width: '500px',
	},
	iconSection : React.CSSProperties = {
		position: 'relative',
		marginBottom: '40px',
		textAlign: 'center',
	},
	content : React.CSSProperties = {
		textAlign: 'center',
		color: '#777777',
	},
	buttonsSection : React.CSSProperties = {
		width: '100%',
		textAlign: 'center',
		marginTop: '40px',
	};
//};

export interface IModalWindowProps {
	msg: string;
	success: boolean;
	callback?: Function;
}

const { messages, locale } = (window['app'] && window['app'].localization) ||
{ messages: {}, locale: 'en' };

class ModalWindow extends React.Component <IModalWindowProps, any> {
	constructor(props: IModalWindowProps){
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
		ReactDOM.unmountComponentAtNode(document.getElementById('modal-section'));
	}
	render(){
		const {success = false, msg} = this.props;
		const icon = success ? <SuccessIcon /> : <AlertIcon />;
		const shownMsg: string | JSX.Element = msg ||
				(success ? <FormattedMessage id="success.thanks"/>
						: <FormattedMessage id="errors.tryLater"/>);
		return(
			<IntlProvider locale={locale} messages={messages}>
				<div className="modal-overlay" style={modalOverlay}>
					<div className="modal-wrapper" style={modalWrapper}>
						<div className="modal" style={modal}>
							<div className="icon-section" style={iconSection}>
								{icon}
							</div>
							<div className="content" style={content}>
								{shownMsg}
							</div>
							<div className="buttonsSection" style={buttonsSection}>
								<button	type="submit" className="button button-primary"
									onClick={this.okBtnClick}>
									<FormattedMessage id="button.ok"/>
								</button>
							</div>
						</div>
					</div>
				</div>
			</IntlProvider>
		);
	}
}
export default ModalWindow;
