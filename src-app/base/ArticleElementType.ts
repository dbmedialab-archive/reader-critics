const names = [
	'title',
	'lead',
	'subtitle',
	'paragraph',
	'figure'
];

const ArticleElementEnum : any = {
	names
};

names.forEach(name => ArticleElementEnum[name] = name);

const ArticleElementType = Object.freeze(ArticleElementEnum);

export default ArticleElementType;
