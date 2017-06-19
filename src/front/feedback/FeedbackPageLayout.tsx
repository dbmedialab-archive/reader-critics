import * as React from 'react';

import ArticleContent from '../section/ArticleContent';
import FloatingActionButton from '../component/FloatingActionButton';
import Footer from '../section/Footer';
import Header from '../section/Header';

const FeedbackPageLayout : React.StatelessComponent <any> = () => <div>
	<Header />
	<ArticleContent />
	<FloatingActionButton/>
	<Footer />
</div>;

export default FeedbackPageLayout;
