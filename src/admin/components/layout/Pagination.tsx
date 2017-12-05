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

import * as React from 'react';
import {Link} from 'react-router-dom';

export interface IPaginationProps {
	current: number;
	total: number;
	link: string;
}
class PaginationPanel extends React.Component<IPaginationProps, any> {
	constructor(props) {
		super(props);
		this.preparePagination = this.preparePagination.bind(this);
		this.setAdditionalButtons = this.setAdditionalButtons.bind(this);
	}

	private setAdditionalButtons(preparedLink: string, pages: any[]) {
		let {current} = this.props;
		const {total} = this.props;

		if (total <= current) {
			current = total;
		}

		// Check if we need Additional buttons
		if (total > 1) {
			const prevLink = (current > 1) ? preparedLink + (current - 1): '#';
			const nextLink = (current !== total) ? preparedLink + (current + 1): '#';
			pages.unshift(
				<li
					className={`pagination-previous${current > 1 ? '' : ' disabled'}`}
						key="pagination-prev"
				>
					{current > 1 ?
					<Link
						to={prevLink}
						title="Previous page">
						Prev
					</Link>:
					<span>Prev</span>}
				</li>
			);
			pages.push(
				<li
					className={`pagination-next${current === total ? ' disabled' : ''}`}
					key="pagination-next"
				>
					{current !== total ?
					<Link
						to={nextLink}
						title="Next page">
						Next
					</Link>:
					<span>Next</span>}
				</li>
			);
		}

		return pages;
	}

	preparePagination() {
		let {current} = this.props;
		const {total, link} = this.props;
		const pages = [];
		const preparedLink = ~link.indexOf('?') ? `${link}&page=` : `${link}?page=`;

		// No pagination if only one page
		if (!total || total < 2) {
			return null;
		}

		// Current page can not be more than total
		if (total < current) {
			current = total;
		}

		for (let i = 1; i <= total; i++) {
			const className = (i === current) ? 'current' : '';
			pages.push(
				<li className={className} key={`pagination-button-${i}`}>
					{i === current ?
						(<span>
							<span className="show-for-sr">You're on page</span> {current}
						</span>):
						<Link
							to={preparedLink + i}
							title={`Page ${i}`}
						>
							{i}
						</Link>
					}
				</li>
			);
		}
		return this.setAdditionalButtons(preparedLink, pages);
	}

	render() {
		const pages = this.preparePagination();
		return (
			<ul className="pagination text-center" role="navigation" aria-label="Pagination">
				{pages}
			</ul>
		);
	}
}

export default PaginationPanel;
