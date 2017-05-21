declare function require(arg : string) : any;

// Import service interfaces

import ArticleService from './article/ArticleService';
import TemplateService from './template/TemplateService';
import WebsiteService from './website/WebsiteService';

// Determine execution environment

import * as app from 'util/applib';

const env : string = app.env === 'test' ? 'mock' : 'live';

// Declare service exports

export const Article : ArticleService = require(`./article/ArticleService.${env}`);
export const Template : TemplateService = require(`./template/TemplateService.${env}`);
export const Website : WebsiteService = require(`./website/WebsiteService.${env}`);
