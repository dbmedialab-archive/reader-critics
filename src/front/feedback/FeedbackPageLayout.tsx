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

import Footer from 'front/common/Footer';
import Header from 'front/common/Header';

import FeedbackContainer from './FeedbackContainer';

const FeedbackPageLayout : React.StatelessComponent <any> =	() => {
	let container : FeedbackContainer;

	return <div>
		<Header />
		<FeedbackContainer ref={(i : any) => { container = i; }} />
		<Footer />
	</div>;
};

export default FeedbackPageLayout;
