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

const Footer : React.StatelessComponent <any> =
	() => <footer id='main-footer'>
		<div className='container'>
			<div className='content four columns'>
				<span>Ris eller ros?</span>
				<a title='Gi oss din tilbakemelding på verktøyet' href='/suggestion-box'>
					Gi oss din tilbakemelding på verktøyet
				</a>
			</div>
			<div className='content four columns'>
				<span>Ansvarlig redaktør <a href='#'>John Arne Markussen</a></span>
				<div itemType='http://schema.org/Organization'>
					© 2017 <span itemProp='name'>DB Medialab</span>
				</div>
			</div>
		</div>
	</footer>;

export default Footer;
