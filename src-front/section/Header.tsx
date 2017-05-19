import * as React from 'react';

export default class Header extends React.Component<any, any> {
	public render(){
 		return <header className="mdl-layout__header">
			<div className="mdl-layout__header-row">
				<span className="mdl-layout-title">Title</span>
				<div className="mdl-layout-spacer"></div>
			</div>
		</header>
	}
}
