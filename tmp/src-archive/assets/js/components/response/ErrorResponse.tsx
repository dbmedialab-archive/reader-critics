import * as React from 'react';

export default function ErrorResponse(props) {
	return (
		<div>
			<h3>{props.error.message}</h3>
		</div>
	);
}
