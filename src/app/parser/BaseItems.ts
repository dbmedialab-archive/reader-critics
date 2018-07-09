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

import ArticleItem from 'base/ArticleItem';
import ArticleItemType from 'base/ArticleItemType';

const clean = (s : string) => s.trim().replace(/\s+/g, ' ');

abstract class BaseItems {

	private totalElementCount : number = 0;

	private readonly elementTypeCounts : {} = {};

	constructor() {
		// Preset element type counters
		Object.values(ArticleItemType).forEach(t => this.elementTypeCounts[t] = 0);
	}

	// Generic article element create

	private createEl(type : ArticleItemType, other : any) {
		return {
			type,
			order: {
				item: ++ this.totalElementCount,
				type: ++ this.elementTypeCounts[type],
			},
			...other,
		};
	}

	// Article element creators

	protected createFeaturedImageEl(imgSrc : string, altTxt : string) : ArticleItem {
		return this.createEl(ArticleItemType.FeaturedImage, {
			href: imgSrc,
			text: altTxt ? altTxt.trim() : '',
		});
	}

	protected createFigureEl(href : string, altTxt : string) : ArticleItem {
		return this.createEl(ArticleItemType.Figure, {
			href,
			text: altTxt ? altTxt.trim() : '',
		});
	}

	protected createLinkEl(href : string, text : string) : ArticleItem {
		return this.createEl(ArticleItemType.Link, {
			href,
			text: text.trim(),
		});
	}

	protected createMainTitleEl(title : string) : ArticleItem {
		const text = clean(title);
		return text.length <= 0 ? undefined : this.createEl(ArticleItemType.MainTitle, {
			text,
		});
	}

	protected createSubTitleEl(title : string) : ArticleItem {
		const text = clean(title);
		return text.length <= 0 ? undefined : this.createEl(ArticleItemType.SubTitle, {
			text,
		});
	}

	protected createLeadInEl(leadin : string) : ArticleItem {
		const text = clean(leadin);
		return text.length <= 0 ? undefined : this.createEl(ArticleItemType.LeadIn, {
			text,
		});
	}

	protected createSubHeadingEl(subheading : string) : ArticleItem {
		const text = clean(subheading);
		return text.length <= 0 ? undefined : this.createEl(ArticleItemType.SubHeading, {
			text,
		});
	}

	protected createParagraphEl(paragraph : string) : ArticleItem {
		const text = clean(paragraph);
		return text.length <= 0 ? undefined : this.createEl(ArticleItemType.Paragraph, {
			text,
		});
	}

	protected createSectionParagraphEl(sectionParagraph : string) : ArticleItem {
		const text = clean(sectionParagraph);
		return text.length <= 0 ? undefined : this.createEl(ArticleItemType.SectionParagraph, {
			text,
		});
	}

	protected createSectionTitleEl(sectionTitle : string) : ArticleItem {
		const text = clean(sectionTitle);
		return text.length <= 0 ? undefined : this.createEl(ArticleItemType.SectionTitle, {
			text,
		});
	}

}

export default BaseItems;
