if (typeof window['feedbackParam'] !== 'object') {
	throw new Error('Global feedback parameters are not defined');
}

interface FeedbackParameters {
	article : {
		url : string,
		version : string,
	};
}

const globals : FeedbackParameters = window['feedbackParam'];

export function getArticleURL() : string {
	return globals.article.url;
}

export function getArticleVersion() : string {
	return globals.article.version;
}
