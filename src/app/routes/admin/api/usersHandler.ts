import {
	Request,
	Response,
} from 'express';

import {
	errorResponse,
	okResponse,
} from 'app/routes/api/apiResponse';

export default function(requ : Request, resp : Response) : void {
	try {
		okResponse(resp, {});
	}
	catch (error) {
		errorResponse(resp, error);
	}
}
