import * as React from 'react';

import Footer from '../common/Footer';
import Header from '../common/Header';

import FeedbackContainer from './FeedbackContainer';
import FinishButton from './FinishButton';

const FeedbackPageLayout : React.StatelessComponent <any> =
	() => <div>
		<Header />
		<FeedbackContainer />
		<FinishButton />
		<Footer />
	</div>;

export default FeedbackPageLayout;
