import * as React from 'react';

export interface ElementProps { text: string; type: string; url: string; }


export default class Element extends React.Component<ElementProps, any> {
	constructor(props: ElementProps) {
		super(props);
		this.handleClick = this.handleClick.bind(this);

		this.state = {
			isToggleOn: false,
			style: {
				background: 'none',
			},
		};
	}

	handleClick = () => {
		this.setState({
			isToggleOn: !this.state.isToggleOn,
		});
	}

	render (): JSX.Element {
		let content: JSX.Element;
		switch (this.props.type) {
			case 'h1':
				content = <h1>{this.props.text}</h1>;
				break;

			case 'h2':
				content = <h2>{this.props.text}</h2>;
				break;

			case 'p':
				content = <p>{this.props.text}</p>;
				break;

			case 'img':
				content = <img src={this.props.url} />;
				break;
		}

		return (
			<div onClick={this.handleClick}>
				{ content }

				{this.state.isToggleOn &&
					<textarea></textarea>
				}
			</div>
		);
	}
}
