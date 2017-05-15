declare function require(arg : string) : any;

// Import service interfaces

import TemplateService from './template/TemplateService';
import WebsiteService from './website/WebsiteService';

// Determine execution environment

import * as app from 'util/applib';

const env : string = app.env === 'test' ? 'mock' : 'prod';

// Declare service exports

export const Template : TemplateService = require(`./template/TemplateService.${env}`);
export const Website : WebsiteService = require(`./website/WebsiteService.${env}`);
