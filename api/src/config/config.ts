import { sync } from 'glob';
import { union } from 'lodash';
import * as path from 'path';

export default class Config {
	public static port: number = 4001;
	public static routes: string = './src/routes/**/*.ts';
	public static models: string = './src/models/**/*.ts';

	public static globFiles(location: string): Array<string> {
		return union([], sync(location));
	}
}
