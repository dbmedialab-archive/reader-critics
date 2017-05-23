import * as React from 'react';

interface ArticleProp {
	id: number;
	type : string;
	order : number;
	text : string;
	state : {
		editing : boolean
	}
}

interface ArticleState {
	editing: boolean
}

export default class ArticleElement extends React.Component <ArticleProp, ArticleState> {

	constructor(props : ArticleProp) {
		super()
		this.state = props.state;
	}

	public render() {
		var content;
		switch( this.props.type ){
			case "title":
				content = this.TitleElement();
				break;
			case "lead":
				content = this.LeadElement();
				break;
			case "subtitle":
				content = this.SubtitleElement();
				break;
			default:
				content = this.ParagraphElement();
				break;
		}

		var className = ( this.state.editing ? 'editing' : '' ) + " " + this.props.type;

		return <article className={className}>
			{content}
			<form>
				<fieldset>
					<label htmlFor={`EditText-${this.props.id}`}>Text lines...</label>
					<textarea type="text" rows={3} id="EditText-{this.props.key}" ></textarea>
				</fieldset>
				<fieldset>
					<label>Legg til kommentar</label>
					<textarea/>
				</fieldset>
				<fieldset>
					<label>Legg til lenker</label>
					<input />
				</fieldset>
			</form>
		</article>;
	}

	private TitleElement() {
		return <div>
			<label>Tittel</label>
			<h1>{this.props.text}</h1>
		</div>;
	}

	private SubtitleElement() {
		return <div>
			<label>Mellomtittel {this.props.order}</label>
			<h3>{this.props.text}</h3>
		</div>;
	}

	private LeadElement() {
		return <div>
			<label>Innledning</label>
			<p>{this.props.text}</p>
		</div>;
	}

	private ParagraphElement() {
		return <div>
			<label>Avsnitt {this.props.order}</label>
			<p>{this.props.text}</p>
		</div>;
	}

}
