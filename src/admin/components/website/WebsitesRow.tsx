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
import {Link} from 'react-router-dom';
import { WebsiteProps } from 'admin/types/Website';

export default class WebsitesRow extends React.Component <WebsiteProps, any> {
	constructor(props: WebsiteProps) {
		super(props);

		this.onEdit = this.onEdit.bind(this);
	}

	public onEdit(e: any) :void {
		e.preventDefault();
		return;
	}

	public render (): JSX.Element {
		const style = `row expanded website-row remove-enter-row ${this.props.state}`;
		const chiefEditors = this.props.chiefEditors.map(editor => {
			return editor.name;
		});
		return (
			<div className={style}>
				<div className="column small-3 medium-3">
					<Link to={`/websites/${this.props.name}`}>
						<p>{this.props.name}</p>
					</Link>
				</div>
				<div className="column small-5 medium-4"><p>{this.props.hosts.join(', ')}</p></div>
				<div className="column small-2 medium-3"><p>{chiefEditors.join(', ')}</p></div>
				<div className="column small-2 medium-2"><p>{this.props.parser}</p></div>
			</div>
		);
	}
}
