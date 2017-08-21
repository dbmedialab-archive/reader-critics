//
// LESERKRITIKK v2 (aka Reader Critics)
// Copyright (C) 2017 DB Medialab/Aller Media AS, Oslo, Norway
// https://github.com/dbmedialab/reader-critics/
//
// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.
//
// This program is distributed in the hope that it will be useful, but WITHOUT
// ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
// FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License along with
// this program. If not, see <http://www.gnu.org/licenses/>.
//

import {
	DoneCallback,
	/*!!!*/ Job,
} from 'kue';

import Article from 'base/Article';
import ArticleItem from 'base/ArticleItem';
import Feedback from 'base/Feedback';
import FeedbackItem from 'base/FeedbackItem';

import diffToPlainHTML from 'base/diff/diffToPlainHTML';

import {
	feedbackService,
} from 'app/services';

/*!!!*/ import SendGridMailer from 'app/mail/sendgrid/SendGridMailer';

import * as app from 'app/util/applib';

const log = app.createLog();

export default function(job : any /*Job*/, done : DoneCallback) : Promise <void> {
	if (!job.data.ID) {
		log('Feedback "ID" not found in job data');
		return Promise.resolve();
	}

	const ID : string = job.data.ID;
	log(`Received new feedback event for ID ${ID}`);
	log(job.data);

	return feedbackService.getByID(ID)
	.then((feedback : Feedback) => {
		console.log(JSON.stringify(feedback, undefined, 4));

		feedback.items.forEach((fbItem : FeedbackItem) => {
			const arItem = getRelatedArticleItem(feedback.article, fbItem);
			// TODO check undefined return value
			console.log('ar item:', app.inspect(arItem));
			console.log('fb item:', app.inspect(fbItem));

			if (fbItem.text.length > 0) {
				const dtxt = diffToPlainHTML(arItem.text, fbItem.text);
				log(dtxt);
			}
		});
	})
	.then(() => done());
}

function getRelatedArticleItem(article : Article, fItem : FeedbackItem) {
	return article.items.find((aItem : ArticleItem) => {
		return aItem.order.item === fItem.order.item
			&& aItem.order.type === fItem.order.type
			&& aItem.type === fItem.type;
	});
}
