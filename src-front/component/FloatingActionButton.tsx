import * as React from 'react'

export default ({SendForm, HideMessage, appear, message='Klikk her når du er ferdig med skjemaet.', close=false }:any) => <div className={`fab ${appear ? 'enabled' : 'disabled'} ${close ? 'disabled' : 'enabled'}`}>
		{ message ? <span onClick={HideMessage}>{message}</span> : null }
		<a onClick={SendForm}>Send skjema</a>
	</div>
