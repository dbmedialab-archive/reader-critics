import * as React from 'react';

import ArticleContent from '../section/ArticleContent';
import FeedbackHeader from './FeedbackHeader';

import FinishButton from './FinishButton';
import Footer from '../section/Footer';

const FeedbackPageLayout : React.StatelessComponent <any> = () => <div>
	<FeedbackHeader />
	<ArticleContent />
	<FinishButton />
	<Footer />
</div>;

export default FeedbackPageLayout;
