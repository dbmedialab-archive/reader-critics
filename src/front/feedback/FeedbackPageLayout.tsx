import * as React from 'react';

import ArticleContent from '../section/ArticleContent';
import FeedbackFooter from './FeedbackFooter';
import FeedbackHeader from './FeedbackHeader';

import FinishButton from './FinishButton';

const FeedbackPageLayout : React.StatelessComponent <any> =
	() => <div>
		<FeedbackHeader />
		<ArticleContent />
		<FinishButton />
		<FeedbackFooter />
	</div>;

export default FeedbackPageLayout;
