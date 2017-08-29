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
import WebsitesRow from 'admin/components/website/WebsitesRow';
import { Transition, TransitionGroup } from 'react-transition-group';
import {Link} from 'react-router-dom';

class WebsitesList extends React.Component <any, any> {
	constructor(props) {
		super(props);

		this.updateErrorState = this.updateErrorState.bind(this);
	}

	updateErrorState(message: string = '', touched: boolean = false): void {
		return this.setState({
			serverError: {
				value: message || '',
				touched,
			},
		});
	}

	public render() : JSX.Element {

		const content = this.props.websites.map((website) =>
			<Transition key={website.ID} timeout={300}>
				{(state) => (
					<WebsitesRow
						key={website.ID}
						ID={website.ID}
						name={website.name}
						chiefEditors={website.chiefEditors}
						hosts={website.hosts}
						parser={website.parserClass}
						state={state}
					/>
				)}
			</Transition>
		);
		return (
			<main>
				<section className="row expanded">
					<div className="column small-12">
						<Link className="button" to="/websites/0">Create Website</Link>
					</div>
				</section>
				<section className="websiteTable">
					<div className="row expanded">
						<div className="column small-12 websites-group-holder">
							<div className="websitelist-table-heading">
								<div className="row expanded website-row table-header">
									<div className="column small-3 medium-3">
										<b>Name</b>
									</div>
									<div className="column small-5 medium-4">
										<b>Hosts</b>
									</div>
									<div className="column small-2 medium-3">
										<b>ChiefEditors</b>
									</div>
									<div className="column small-2 medium-2">
										<b>Parser</b>
									</div>
								</div>
								<TransitionGroup>
									{content}
								</TransitionGroup>
							</div>
						</div>
					</div>
				</section>
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
