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

export interface IFilter {
	onSubmit: () => void;
	onChange: (s: string) => void;
	search: string;
	placeholder?: string;
	buttonText?: string;
	clear: () => void;
}

export default class SearchFilter extends React.Component <IFilter, any> {
	constructor (props: IFilter) {
		super(props);
		this.onFilterChange = this.onFilterChange.bind(this);
		this.onKeyUp = this.onKeyUp.bind(this);
	}

	onFilterChange(e: React.FormEvent<HTMLInputElement>) {
		const {value} = e.currentTarget;
		return this.props.onChange(value);
	}

	onKeyUp(e) {
		if (e.keyCode === 13) {
			return this.props.onSubmit();
		}
	}

	render () {
		const {search, placeholder = 'Search...', buttonText = 'Search'} = this.props;
		return (
				<div className="filter-container">
					<div className="row">
						<div className="column small-12 medium-6">
							<input
								className="filter-input" value={search}
								placeholder={placeholder} onChange={this.onFilterChange}
								onKeyUp={this.onKeyUp}
							/>
						</div>
						<div className="small-12 medium-6 large-3">
							<button
								className="button success"
								onClick={this.props.onSubmit}
							>
								{buttonText}
							</button>
							<button
								className="button default"
								onClick={this.props.clear}
							>
								Clear
							</button>
						</div>
					</div>
				</div>
		);
	}
}
