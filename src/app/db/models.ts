import {
	model,
	plugin,
	Document,
	Model,
} from 'mongoose';

import TimestampPlugin from './plugins/TimestampPlugin';

import {
	ArticleSchema,
	SuggestionSchema,
} from './schemas';

import {
	Article,
	Suggestion,
} from 'base';

// Install global plugins

plugin(TimestampPlugin);

// Create models

export interface ArticleDocument extends Article, Document {}
export const ArticleModel : Model <ArticleDocument>
	= model <ArticleDocument> ('Article', ArticleSchema);

export interface SuggestionDocument extends Suggestion, Document {}
export const SuggestionModel : Model <SuggestionDocument>
	= model <SuggestionDocument> ('Suggestion', SuggestionSchema);
