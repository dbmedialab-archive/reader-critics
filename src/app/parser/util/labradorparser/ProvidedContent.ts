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
import {pick} from 'lodash';
//import ArticleItem from 'base/ArticleItem';
import ArticleItemType from 'base/ArticleItemType';
import ArticleAuthor from 'base/ArticleAuthor';

// @TODO move it somewhere in general place, for all parsers to implement

export interface ImageInterface {
	type: any;
	href: string;
	altText: string;
	name: string;
}

export interface ProvidedContent {
	version: string;
	authors : any;
	title : any;
	subtitle : any;
	image : any;
	video : any;
}

export interface TitleInterface {
	text: any,
	type: any,
}

export interface SubTitleInterface {
	text: any,
	type: any,
}

export interface VideoInterface {
	previewURL: string;
	thumbURL: string;
	publishURL: string;
	description: string;
	title: string;
	type: any;
}

/**
 * Facade method for all provided content entities.
 */
export function getContent (rawArticle) : ProvidedContent {
	const content : ProvidedContent = {
		version: getVersion(rawArticle),
		authors: (rawArticle.contentBoxes && rawArticle.contentBoxes.byline)
		? getAuthors(rawArticle.contentBoxes.byline)
		: [],
		title: getTitle(rawArticle),
		subtitle: getSubtitle(rawArticle),
		image: (rawArticle.contentBoxes && rawArticle.contentBoxes.image) ? getImages(rawArticle) : [],
		video: (rawArticle.contentBoxes && rawArticle.contentBoxes.youtube)
		? getVideos(rawArticle.contentBoxes.youtube)
		: null,
	}

	return content;
}

/**
 * Authors bunch getter.
 */
function getAuthors (byline) : ArticleAuthor[] {
	if (Array.isArray(byline)) { // serveral authors
		const authors = byline.map((author) => {
			return compileAuthor(author);
		});

		return authors;
	} else { // single author
		return  [compileAuthor(byline)];
	}
}

/**
 * Returns single author formatted.
 */
function compileAuthor (rawData) : ArticleAuthor {
	const authorFields = ['email', 'lastname', 'firstname'];
	const defaultFields = {
		lastname: '',
		firstname: '',
		email: '',
	};
	let raw = Object.assign(defaultFields, pick(rawData, authorFields));

	return {
		email: raw.email,
		name: raw.firstname + ' ' + raw.lastname,
	};
}

/**
 * Title getter.
 */
function getTitle (rawData) : TitleInterface {
	return {
		text: rawData.title ? rawData.title : '',
		type: ArticleItemType.MainTitle,
	};
}

/**
 * Subtitle getter.
 */
function getSubtitle (rawData) : SubTitleInterface {
	return {
		text: rawData.subtitle ? rawData.subtitle : '',
		type: ArticleItemType.SubTitle,
	};
}

/**
 * Bunch image getter.
 */
function getImages (rawArticle) : ImageInterface[] {
	const defaultHeight = 400;
	const featuredID = getFeaturedID(rawArticle);
	const res = rawArticle.contentBoxes.image.map((img) => {
		if (img.instanceOfId) {
			return {
				nativeURL: img.imageurl,
				href: `https://dbstatic.no/?imageId=${img.instanceOfId}&height=${defaultHeight}`,
				altText: img.imageCaption,
				name: img.name,
				type: (img.instanceOfId == featuredID) ? ArticleItemType.FeaturedImage : ArticleItemType.Figure,
			};
		}

	});
	return res;
}

/**
 * This featured image ID logic is not always correct.
 * @TODO find correct one.
 */
function getFeaturedID (rawArticle) : any {
	return rawArticle.image;
}

/**
 * Formats bunch of videos
 */
function getVideos (videos) : VideoInterface[] {
	if (Array.isArray(videos)) {
		const vids = videos.map((video) => {
			return compileVideo(video);
		});

		return vids;
	} else {
		return  [compileVideo(videos)];
	}

}

/**
 * Returns proper video fields for single entity
 */
function compileVideo (video) : VideoInterface {
	if (video) {
		return {
			previewURL: video.preview,
			thumbURL: video.thumb_url,
			publishURL: video.published_url,
			description: video.description,
			title: video.title,
			type: ArticleItemType.Video,
		};
	}

	return null;
}

/**
 * Fetch modified date or created.
 * returns in date in ISO format.
 */
function getVersion (article) : string {
	const timeSource = article.modified ? article.modified * 1000 : article.created;
	const d = new Date(timeSource);

	return d.toISOString();
}
