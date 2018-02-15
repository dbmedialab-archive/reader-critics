import ArticleItem from './ArticleItem';

export interface FeedbackItem extends ArticleItem {
	text : string|null
	comment : string|null
	links : string[]
}

export default FeedbackItem;
