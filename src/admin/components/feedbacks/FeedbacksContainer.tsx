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

import FeedbackItem from 'base/FeedbackItem';
import Layout from 'admin/components/layout/LayoutComponent';
import FeedbackItemComponent from 'admin/components/feedbacks/FeedbackItemComponent';
import * as FeedbacksActions from 'admin/actions/FeedbacksActions';

class FeedbacksContainer extends React.Component <any, any> {
	constructor(props) {
		super(props);
	}
	componentDidMount(){
		FeedbacksActions.getFeedbackList();
	}
	render(){
		const feedbacks = this.props.feedbacks.map((feedback)=>{
			return feedback.items.map((feedbackItem: FeedbackItem)=>{
				const feedbackObj = {
					...feedbackItem,
					article: feedback.article,
					date: feedback.date,
				};
				return <FeedbackItemComponent
								feedback={feedbackObj}
								key={feedback.article.ID+'_'+feedbackItem.order.item}/>;
			});
		});
		return (
			<Layout pageTitle="Feedbacks">
				<div className="feedback-list">
					{feedbacks}
				</div>
			</Layout>
	);
	}
}
const mapStateToProps = (state, ownProps) => {
	return {
		feedbacks: state.feedback,
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(FeedbacksContainer);
