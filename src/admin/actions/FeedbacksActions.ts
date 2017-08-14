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

import ArticleItemType from 'base/ArticleItemType';
import FeedbackStatus from 'base/FeedbackStatus';
import MainStore from 'admin/stores/MainStore';
import Feedback from 'base/Feedback';
import * as FeedbacksActions from './FeedbacksActions';
import * as FeedbacksActionsCreator from 'admin/actions/FeedbacksActionsCreator';

export function setFeedbackList(feedbacks: Array<Feedback>) {
	console.log(feedbacks);
	MainStore.dispatch(
		FeedbacksActionsCreator.setFeedbackList(feedbacks)
	);
}

export function getFeedbackList() {
	const feedbacks = [
		{
			article: {
				url: {
					href: 'https://dagbladet.no/asdasd',
				},
				version: '1',
				authors: [
						{
							name: 'Dmitry',
							email: 'dm@gmail.com',
						},
				],
				items: [
					{
						type :ArticleItemType.Paragraph,
						order: {
							item: 1,
							type: 2,
						},
					},
				],
			},
			enduser: {
				name: 'dm',
				email: 'test@test.com',
			},
			items: [
				{
					id: 1,
					text : 'test comment',
					comment : 'test user comment',
					links : [
						`http://www.dagbladet.no/nyheter/de-forteller-om-drapsforsok-
						gruppevoldtekter-og-kidnapping/68583104`,
						`http://www.dagbladet.no/nyheter/jeg-minner-om-at-det-ikke-er-
						lenge-siden-en-prostituert-kvinne-ble-drept-i-byen-var/68576561`,
					],
					type : ArticleItemType.Paragraph,
					order: {
						item: 1,
						type: 2,
					},
				},
			],
			status: FeedbackStatus.New,
			date : {
				statusChange : new Date(),
			},
		},
		{
			article: {
				url: {
					href: 'https://dagbladet.no/asdasd',
				},
				version: '1',
				authors: [
						{
							name: 'Dmitry',
							email: 'dm@gmail.com',
						},
				],
				items: [
					{
						type :ArticleItemType.Paragraph,
						order: {
							item: 1,
							type: 2,
						},
					},
				],
			},
			enduser: {
				name: 'dm',
				email: 'test@test.com',
			},
			items: [
				{
					id: 3,
					text : 'test comment222',
					comment : 'test user comment2222',
					links : [
						`http://www.dagbladet.no/nyheter/de-forteller-om-drapsforsok-
						gruppevoldtekter-og-kidnapping/68583104`,
						`http://www.dagbladet.no/nyheter/jeg-minner-om-at-det-ikke-er-
						lenge-siden-en-prostituert-kvinne-ble-drept-i-byen-var/68576561`,
					],
					type : ArticleItemType.Paragraph,
					order: {
						item: 1,
						type: 2,
					},
				},
			],
			status: FeedbackStatus.New,
			date : {
				statusChange : new Date(),
			},
		},
	];

	//FeedbacksActions.setFeedbackList(feedbacks);
}
