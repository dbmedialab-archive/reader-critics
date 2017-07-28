import ArticleItem from './ArticleItem';

interface FeedbackItem extends ArticleItem {
	userText : String|null;
	comment : String|null;
	links : String[];
}

export default FeedbackItem;
