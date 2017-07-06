import * as Mongoose from 'mongoose';

import TimestampPlugin from './plugins/TimestampPlugin';

import {
	ArticleSchema,
	SuggestionSchema,
} from './schemas';

import {
	Article,
	Suggestion,
} from 'base/';

// Install global plugins

Mongoose.plugin(TimestampPlugin);

// Create models

export interface ArticleDocument extends Article, Mongoose.Document { }
export const ArticleModel = Mongoose.model <ArticleDocument> ('Article', ArticleSchema);

export interface SuggestionDocument extends Suggestion, Mongoose.Document { }
export const SuggestionModel = Mongoose.model <SuggestionDocument> ('Suggestion', SuggestionSchema);
