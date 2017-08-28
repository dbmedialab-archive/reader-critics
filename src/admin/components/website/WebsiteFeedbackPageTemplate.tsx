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
import AdminConstants from 'admin/constants/AdminConstants';
import {connect} from 'react-redux';
import * as UIActions from 'admin/actions/UIActions';

class WebsiteFeedbackPageTemplate extends React.Component <any, any> {
	constructor (props) {
		super(props);
		this.onEditClick = this.onEditClick.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	public onEditClick(e: any) :void {
		e.preventDefault();
		const windowName = AdminConstants.WEBSITE_TEMPLATE_FEEDBACK_MODAL_NAME;
		const {feedbackPage} = this.props;
		const templateRes = {
			input: {},
			isOpen: true,
			websiteName: this.props.websiteName || null,
			onSubmit: this.onSubmit,
		};
		templateRes.input['template'] = { value: feedbackPage };
		UIActions.modalWindowsChangeState(windowName, templateRes);
	}

	onSubmit(data) {
		return this.props.onSubmit({
			layout: {
				templates: {
					feedbackPage: data,
				},
			},
		});
	}

	render () {
		return (
			<fieldset className="website-templates">
				<label htmlFor="feedback-page">
					Feedback Page Template:
					<a onClick={this.onEditClick} className="button default" href="#">
						Edit
					</a>
				</label>
				<span>Preview coming soon</span>
			</fieldset>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	return {
		feedbackPage: state.website.getIn(['selected', 'layout', 'templates', 'feedbackPage']) || '',
		websiteName: state.website.getIn(['selected', 'name']) || '',
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(WebsiteFeedbackPageTemplate);
