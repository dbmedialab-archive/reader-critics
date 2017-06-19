import * as React from 'react';

import ArticleContent from '../section/ArticleContent';
import FinishButton from './FinishButton';
import Footer from '../section/Footer';
import Header from '../section/Header';

const FeedbackPageLayout : React.StatelessComponent <any> = () => <div>
	<Header />
	<ArticleContent />
	<FinishButton />
	<Footer />
</div>;

export default FeedbackPageLayout;
