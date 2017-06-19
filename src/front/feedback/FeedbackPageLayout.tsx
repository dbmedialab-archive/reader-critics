import * as React from 'react';

import FeedbackContainer from './FeedbackContainer';
import FeedbackFooter from './FeedbackFooter';
import FeedbackHeader from './FeedbackHeader';

import FinishButton from './FinishButton';

const FeedbackPageLayout : React.StatelessComponent <any> =
	() => <div>
		<FeedbackHeader />
		<FeedbackContainer />
		<FinishButton />
		<FeedbackFooter />
	</div>;

export default FeedbackPageLayout;
