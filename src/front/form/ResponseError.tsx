import * as React from 'react';

export interface ResponseErrorProps {
	/** The Error Text */
	errorText: string | boolean;
}

export const ResponseError: React.StatelessComponent <ResponseErrorProps> =
	(props : ResponseErrorProps) => {
		if (!props.errorText) {
			return null;
		}
		return (
			<small className="callout secondary alert error">{props.errorText}</small>
		);
	};
