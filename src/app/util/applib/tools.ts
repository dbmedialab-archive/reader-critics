import { isDate } from 'lodash';

export const isValidDate =
	(d : Date) : boolean => (isDate(d) && !isNaN(d.getTime()));
