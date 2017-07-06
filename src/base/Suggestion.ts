interface Suggestion {
	email : string;
	comment : string;

	date?: {
		created : Date;
	};

	remote: {
		ipAddress : string;
		userAgent : string;
	};
}

export default Suggestion;
