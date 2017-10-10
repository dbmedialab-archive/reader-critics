import { isEmpty } from 'lodash';

import ArticleAuthor from 'base/ArticleAuthor';
import Feedback from 'base/Feedback';
import Website from 'base/Website';

export default function (website : Website, feedback : Feedback) : Promise <Array <string>> {
	const recipients : Array <string> = feedback.article.authors
		.filter((author : ArticleAuthor) => !isEmpty(author.email))
		.map((author : ArticleAuthor) => author.email);

	if (isEmpty(recipients)) {
		recipients.push(website.chiefEditors.)
	}

	return Promise.resolve(recipients);
}
