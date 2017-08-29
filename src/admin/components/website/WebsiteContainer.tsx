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
import WebsiteBottomPanel from 'admin/components/website/WebsiteBottomPanel';

class WebsiteContainer extends React.Component <any, any> {
	constructor(props) {
		super(props);

		this.onSubmit = this.onSubmit.bind(this);
		this.handleData = this.handleData.bind(this);
		this.onCreate = this.onCreate.bind(this);
	}
	componentWillMount(){
		WebsiteActions.getSelectedWebsite(this.props.match.params.name);
		UsersActions.getUsers();
	}
	componentWillUnmount() {
		WebsiteActions.setSelectedWebsite(null);
	}

	handleData(data) {
		const {name, ID} = this.props;
		if (ID) {
			const dataToSend = Object.assign({name}, data);
			this.onSubmit(dataToSend);
		} else {
			return WebsiteActions.updateSelectedWebsite(data);
		}
	}
	onSubmit(data) {
		return WebsiteActions.updateWebsite(data);
	}
	onCreate() {
		return WebsiteActions.createWebsite(this.props.website);
	}
	render(){
		return (
			<Layout pageTitle="Website">
				<WebsiteComponent onSubmit={this.handleData}/>
				<EditTemplateModalComponent windowName={AdminConstants.WEBSITE_TEMPLATE_FEEDBACK_MODAL_NAME} />
				<WebsiteBottomPanel onSubmit={this.onCreate}/>
			</Layout>
	);
	}
}

const mapStateToProps = (state, ownProps) => {
	return {
		name: state.website.getIn(['selected', 'name']) || '',
		ID: state.website.getIn(['selected', 'ID']) || null,
		website: state.website.getIn(['selected']) || {},
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(WebsiteContainer);
