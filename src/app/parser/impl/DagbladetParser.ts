import Article from 'base/Article';
import Parser from 'base/Parser';

import GenericParser from './GenericParser';

import { getOpenGraphModifiedTime } from '../VersionParser';

import * as app from 'app/util/applib';

const log = app.createLog();

export default class DagbladetParser extends GenericParser {

	protected parseVersion() : string {
		log('parseVersion');
		return getOpenGraphModifiedTime(this.select);
	}

}
