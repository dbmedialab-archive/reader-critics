import * as React from 'react';

export interface InputErrorProps {
	/** The Error Text */
	errorText: string | boolean;
	/** Is touched field */
	touchedField: boolean | undefined;
}

export default class InputError extends React.Component <InputErrorProps, any> {

	constructor(props: InputErrorProps) {
		super(props);
	}

	render(): JSX.Element {
		if (!this.props.errorText || !this.props.touchedField) {
			return null;
		}
		return (
			<small className='callout secondary alert error'>{this.props.errorText}</small>
		);
	}

}
