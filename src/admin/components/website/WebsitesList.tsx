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
import { connect } from 'react-redux';
import WebsitesGriddle from 'admin/components/website/WebsitesGriddle';
import { Transition, TransitionGroup } from 'react-transition-group';
import AdminConstants from 'admin/constants/AdminConstants';
import * as WebsiteActions from 'admin/actions/WebsiteActions';
import * as UIActions from 'admin/actions/UIActions';

class WebsitesList extends React.Component <any, any> {
	constructor(props) {
		super(props);

		this.updateErrorState = this.updateErrorState.bind(this);
		this.onCreate = this.onCreate.bind(this);
	}

	updateErrorState(message: string = '', touched: boolean = false): void {
		return this.setState({
			serverError: {
				value: message || '',
				touched,
			},
		});
	}

	public onCreate(e: any): void {
		e.preventDefault();
		const windowName = AdminConstants.WEBSITE_MODAL_NAME;
		const websiteRes = {
			isOpen: true,
		};
		UIActions.modalWindowsChangeState(windowName, websiteRes);
		WebsiteActions.setSelectedWebsite(null);
	}

	public render() : JSX.Element {
		return (
			<main>
				<section className="row expanded">
					<div className="column small-12">
						<button type="button" onClick={this.onCreate} className="button">Create Website</button>
					</div>
				</section>
				<WebsitesGriddle/>
			</main>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	return {
		websites: state.website.getIn(['websites']) || [],
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(WebsitesList);
