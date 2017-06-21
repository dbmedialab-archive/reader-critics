import * as React from 'react';

import Footer from 'front/common/Footer';
import Header from 'front/common/Header';

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
