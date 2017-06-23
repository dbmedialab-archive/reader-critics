import ArticleURL from 'base/ArticleURL';
import Website from 'base/Website';

import * as app from 'app/util/applib';

const log = app.createLog();

const wsDagbladet : Website = {
	name: 'dagbladet.no',
};

const wsVG : Website = {
	name: 'vg.no',
};

const wsAftenposten : Website = {
	name: 'aftenposten.no',
};

export default function(articleURL : ArticleURL|string) : Website {
	const url : string = (articleURL instanceof ArticleURL)
		? articleURL.href : articleURL;

	log(url);

	const websites : Website[] = [
		wsDagbladet,
		wsVG,
		wsAftenposten,
	];

	return websites.find((site : Website) => {
		const rx = new RegExp(`^https?:\/\/.*${site.name}/`);
		return rx.test(url);
	});
}
