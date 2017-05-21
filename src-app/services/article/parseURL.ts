import { isEmpty } from 'lodash';

const containsHex = /(?:%3A|%2F)/;  // Detect encoded ':' and '/' characters

export default function (origURL : string) : string {
	if (isEmpty(origURL)) {
		return '';
	}

	return containsHex.test(origURL) ? decodeURIComponent(origURL) : origURL;
}
