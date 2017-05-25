import * as React from 'react'
import ArticleEditForm from './../component/ArticleEditForm'
import * as Diff from 'text-diff'


interface ArticleProp {
	index: number;
	type : string;
	order : number;
	text : string;
	comment: string;
	editing: boolean;
}
interface ArticleState {
	editing: boolean;
	text: string;
	comment: string;
	origionalText: string;
	edited: boolean;
	link: Array<string>;
}

export default class ArticleElement extends React.Component<ArticleProp, ArticleState> {

	constructor ( props:ArticleProp ){
		super()
		this.state = {...props, origionalText: props.text, link: [], comment: "", editing: false, edited: false }
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
				<ArticleEditForm id={this.props.index} {...this.state} link={this.state.link} comment={this.state.comment} onCancel={this.CancelInput.bind(this)} onSave={this.SaveData.bind(this)} type={this.props.type} />
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
				<label>Mellomtittel {this.props.order}</label>
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
				<label>Avsnitt {this.props.order}</label>
				<p>{this.state.text}</p>
			</div>;
	}

	// TextDiff()
	// @param n/a
	// Caclulates and highlights the diff of two sentences.
	// Used to preview changes to the text done by the user.
	private TextDiff(){
		const diff = new Diff();
		const textDiff = diff.main(  this.state.origionalText, this.state.text  );
		return diff.prettyHtml( textDiff );
	}

	// EnableEditing()
	// @param n/a
	// Changes the state for the component so correct css-classes are applied
	private EnableEditing() {
		if (!this.state.editing) this.setState({ editing: true })
	}

	// DisableEditing()
	// @param n/a
	// Changes the state for the component so correct css-classes are applied
	private DisableEditing() {
		if (this.state.editing) this.setState({ editing: false })
	}

	// RestoreOrigionalContent( e:any )
	// @param {event} e
	// Stops bubbeling then resets the parrent components state.
	// TODO: This should rerender the child,
	// however the child still seams to contain the initial data...
	private RestoreOrigionalContent( e:any ){
		e.stopPropagation()
		const state = Object.assign( {}, {...this.state, edited : false, link: [], text: this.state.origionalText, comment: "" })
		this.setState( state )
		this.DisableEditing()
	}

	// CancelInput()
	// @param n/a
	// Callback for childs onCancel funciton.
	private CancelInput(){
		this.DisableEditing()
	}

	// SaveData( state:object )
	// @param {state} state
	// Applies the submitted state (from the child component) to the parents state.
	// This is passed to the child as a prop and used as callback.
	private SaveData( state:object ){
		this.DisableEditing()
		this.setState( {...state, edited:true} )
	}
}
