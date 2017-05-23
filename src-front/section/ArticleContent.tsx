import * as React from 'react';
import ArticleElement from './../component/ArticleElement';

var test = [
	{ type: "title",     text: "The Article Title is Medium Long and Large", order: 1 },
	{ type: "lead",      text: "The lead has a bunch of stuff in it that gives the article some context.", order: 1 },
	{ type: "paragraph", text: "foo", order: 1 },
	{ type: "paragraph", text: "foo", order: 2 }
]

export default class ArticleContent extends React.Component<any, any> {

	constructor (){
		super();
		this.state = { editing : false };
	}

	public render(){
		const content = test.map( (props, index) => <ArticleElement key={index} id={index} {...props} state={this.state}/> )
		return <section id="content">
			{content}
		</section>
	}
}
