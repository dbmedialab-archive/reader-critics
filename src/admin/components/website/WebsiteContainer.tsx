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

import Layout from 'admin/components/layout/LayoutComponent';
import * as WebsiteActions from 'admin/actions/WebsiteActions';
import * as UsersActions from 'admin/actions/UsersActions';
import WebsiteComponent from 'admin/components/website/WebsiteComponent';
import {connect} from 'react-redux';
import AdminConstants from 'admin/constants/AdminConstants';
import EditTemplateModalComponent from 'admin/components/modal/EditTemplateModalComponent';

class WebsiteContainer extends React.Component <any, any> {
	constructor(props) {
		super(props);

		this.onSubmit = this.onSubmit.bind(this);
		this.handleData = this.handleData.bind(this);
	}
	componentDidMount(){
		WebsiteActions.getWebsiteList();	//TODO move to separate component WebsitesList
		WebsiteActions.getSelectedWebsite(this.props.match.params.name);
		UsersActions.getUsers();
	}

	handleData(data) {
		const name = this.props.name;
		const dataToSend = Object.assign({name}, data);
		this.onSubmit(dataToSend);
	}
	onSubmit(data) {
		return WebsiteActions.updateWebsite(data);
	}
	render(){
		return (
			<Layout pageTitle="Website">
				<WebsiteComponent onSubmit={this.handleData}/>
				<EditTemplateModalComponent windowName={AdminConstants.WEBSITE_TEMPLATE_FEEDBACK_MODAL_NAME} />
			</Layout>
	);
	}
}

const mapStateToProps = (state, ownProps) => {
	return {
		name: state.website.getIn(['selected', 'name']) || '',
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(WebsiteContainer);
