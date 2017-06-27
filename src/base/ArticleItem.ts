import ArticleItemType from 'base/ArticleItemType';

interface ArticleItem {
	type : ArticleItemType;

	order: {
		item: number,
		type: number,
	};

}

export default ArticleItem;
