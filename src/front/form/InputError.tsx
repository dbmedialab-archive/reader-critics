import * as React from 'react';

export interface InputErrorProps {
	/** The Error Text */
	errorText: string | boolean;
	/** Is touched field */
	touchedField: boolean | undefined;
}

export const InputError: React.StatelessComponent <InputErrorProps> =
	(props : InputErrorProps) => {
		if (!props.errorText || !props.touchedField) {
			return null;
		}
		return (
			<small className='callout secondary alert error'>{props.errorText}</small>
		);
	};

