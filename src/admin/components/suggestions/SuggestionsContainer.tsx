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
import {connect} from 'react-redux';

import Layout from 'admin/components/layout/LayoutComponent';
import SuggestionsListItemComponent
	from 'admin/components/suggestions/SuggestionsListItemComponent';
import * as SuggestionsActions from 'admin/actions/SuggestionsActions';

class SuggestionsContainer extends React.Component <any, any> {
	constructor (props) {
		super(props);
	}

	componentDidMount () {
		SuggestionsActions.getSuggestionsList();
	}

	render () {
		const suggestions = this.props.suggestions.map((suggestion) => {
			return <SuggestionsListItemComponent
				suggestion={suggestion}
				key={suggestion.ID}/>;
		});
		return (
			<Layout pageTitle="Suggestions">
				<div className="suggestions-list">
					{suggestions}
				</div>
			</Layout>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	return {
		suggestions: state.suggestions,
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(SuggestionsContainer);
