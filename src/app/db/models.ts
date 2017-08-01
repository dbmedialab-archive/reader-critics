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
	model,
	plugin,
	Document,
	Model,
} from 'mongoose';

import ArticleSchema from './schemas/ArticleSchema';
import EndUserSchema from './schemas/EndUserSchema';
import SuggestionSchema from './schemas/SuggestionSchema';
import UserSchema from './schemas/UserSchema';
import WebsiteSchema from './schemas/WebsiteSchema';

import Article from 'base/Article';
import EndUser from 'base/EndUser';
import Suggestion from 'base/Suggestion';
import User from 'base/User';
import Website from 'base/Website';

import TimestampPlugin from './plugins/TimestampPlugin';

// Install global plugins

plugin(TimestampPlugin);

// Create models

export interface ArticleDocument extends Article, Document {}
export const ArticleModel : Model <ArticleDocument>
	= model <ArticleDocument> ('Article', ArticleSchema);

export interface EndUserDocument extends EndUser, Document {}
export const EndUserModel : Model <EndUserDocument>
	= model <EndUserDocument> ('EndUser', EndUserSchema);

export interface SuggestionDocument extends Suggestion, Document {}
export const SuggestionModel : Model <SuggestionDocument>
	= model <SuggestionDocument> ('Suggestion', SuggestionSchema);

export interface UserDocument extends User, Document {}
export const UserModel : Model <UserDocument>
	= model <UserDocument> ('User', UserSchema);

export interface WebsiteDocument extends Website, Document {}
export const WebsiteModel : Model <WebsiteDocument>
	= model <WebsiteDocument> ('Website', WebsiteSchema);
