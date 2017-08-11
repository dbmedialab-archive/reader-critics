import ArticleItem from './ArticleItem';

interface FeedbackItem extends ArticleItem {
	id?: Number,
	text : String|null;
	comment : String|null;
	links : String[];
}

export default FeedbackItem;
