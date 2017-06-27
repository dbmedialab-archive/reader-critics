import * as React from 'react';
import '../scss/admin.scss';
export interface TestContainerState{}
export default class TestContainer
extends React.Component <any, TestContainerState> {

	constructor() {
		super();
		this.state = {};
	}

	componentWillMount() {

	}

	public render() {
		return <section id='admin'>
			testSection
		</section>;
	}
}
