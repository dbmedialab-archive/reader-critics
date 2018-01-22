import * as moment from 'moment';

export type PollParam = {
	pastBase? : moment.Duration,
	querySpan : moment.Duration,
	pollSpan : moment.Duration,
};

export const pollParams : PollParam[] = [
	{
		querySpan: moment.duration({ hours: 24 }),
		pollSpan: moment.duration({ hours: 1 }),
	},
	{
		pastBase: moment.duration({ hours: 24 }),
		querySpan: moment.duration({ hours: 48 }),
		pollSpan: moment.duration({ hours: 2 }),
	},
	{
		pastBase: moment.duration({ hours: 72 }),
		querySpan: moment.duration({ hours: 96 }),
		pollSpan: moment.duration({ hours: 4 }),
	},
];
