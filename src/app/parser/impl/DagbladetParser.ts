import Article from 'base/Article';
import Parser from 'base/Parser';

import GenericParser from './GenericParser';

import { getOpenGraphModifiedTime } from '../util/VersionParser';

export default class DagbladetParser extends GenericParser {

	protected parseVersion() : string {
		return getOpenGraphModifiedTime(this.select);
	}

}
