import * as React from 'react';
import ArticleElement from './../component/ArticleElement';

var test = [
	{ type: "title",     text: "The Article Title is Medium Long and Large", typeIndex: 1 },
	{ type: "lead",      text: "The lead has a bunch of stuff in it that gives the article some context.", typeIndex: 1 },
	{ type: "paragraph", text: "foo", typeIndex: 1 },
	{ type: "paragraph", text: "foo", typeIndex: 2 }
]

export default class ArticleContent extends React.Component<any, any> {


	constructor (){
		super();
		this.state = { editing : false, edited: false };
	}

	public render(){
		const content = test.map( (props, index) => <ArticleElement key={index} id={index} {...props} {...this.state}/> )
 		return <section id="content">
 			{content}
 		</section>
	}
}
