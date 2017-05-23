import * as React from 'react'
import ArticleEditForm from './../component/ArticleEditForm'
import * as Diff from 'text-diff'


interface ArticleProp {
	id: number;
	type : string;
	typeIndex : number;
	text : string;
	comment: string;
	editing: boolean;
}
interface ArticleState {
	editing: boolean;
	textPreview : string;
	text: string;
	comment: string;
	origionalText: string;
	edited: boolean;
	link: Array<string>;
	edited: boolean;
}

export default class ArticleElement extends React.Component<ArticleProp, ArticleState> {

	constructor ( props:ArticleProp ){
		super()
		this.state = {...props, origionalText: props.text, link: [], comment: "", textPreview: "", editing: false, edited: false }
	}

	public render() {
		var content;
		switch( this.props.type ){
			case "title":
				content =  this.TitleElement()
				break;
			case "lead":
				content =  this.LeadElement()
				break;
			case "subtitle":
				content =  this.SubtitleElement()
				break;
			default:
				content = this.ParagraphElement()
				break;
		}

		const className = `card ${this.state.editing ? 'editing' : '' } ${this.state.edited ? 'edited' : '' } ${this.props.type}`;

		return <article onClick={()=>this.EnableEditing()} className={className}>
				<header>
					{content}
				</header>
				<ArticleEditForm {...this.state} link={this.state.link} comment={this.state.comment} onCancel={this.CancelInput.bind(this)} onSave={this.SaveData.bind(this)} type={this.props.type} />
				<footer>
					<a className="button reset" onClick={ this.RestoreOrigionalContent.bind(this) }>Slett</a>
					<a className="button edit">Rediger</a>
				</footer>
		</article>;
	}

	private TitleElement() {
		return <div>
				<label>Tittel</label>
				<h1 dangerouslySetInnerHTML={{ __html:  this.TextDiff()}} />
			</div>;
	}

	private SubtitleElement() {
		return <div>
				<label>Mellomtittel {this.props.typeIndex}</label>
				<h3 dangerouslySetInnerHTML={{ __html:  this.TextDiff()}} />
			</div>;
	}

	private LeadElement() {
		return <div>
				<label>Innledning</label>
				<p  dangerouslySetInnerHTML={{ __html:  this.TextDiff()}} />
			</div>;
	}

	private ParagraphElement() {
		return <div>
				<label>Avsnitt {this.props.typeIndex}</label>
				<p>{this.state.text}</p>
			</div>;
	}

	private TextDiff(){
		const diff = new Diff();
		const textDiff = diff.main(  this.state.origionalText, this.state.text  );
		return diff.prettyHtml( textDiff );
	}


	private EnableEditing() {
		if (!this.state.editing) this.setState({ editing: true })
	}

	private DisableEditing() {
		if (this.state.editing) this.setState({ editing: false })
	}

	private RestoreOrigionalContent( e:any ){
		e.stopPropagation()
		this.setState({ edited : false, link: [], text: this.state.origionalText, comment: "" })
		this.DisableEditing()
	}

	private CancelInput(){
		this.DisableEditing()
	}

	private SaveData( state:object ){
		this.DisableEditing()
		this.setState( {...state, edited:true} )
	}
}
