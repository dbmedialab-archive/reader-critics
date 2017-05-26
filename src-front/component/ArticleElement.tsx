import * as React from 'react';

import {
	default as ArticleEditForm,
	ArticleEditFormState,
} from '../component/ArticleEditForm';
import textDiffToHTML from './textDiffToHTML';

interface ArticleElementProp {
	elemOrder : number;
	typeOrder : number;
	type : string;
	text : string;
	// comment: string;
}

interface ArticleElementState {
	editing: boolean;
	text: string;
	comment: string;
	originalText: string;
	edited: boolean;
	link: Array<string>;
}

export default class ArticleElement extends React.Component <ArticleElementProp, ArticleElementState> {

	constructor(props : ArticleElementProp) {
		super();
		this.state = {
			...props,
			originalText: props.text,
			link: [],
			comment: '',
			editing: false,
			edited: false,
		};
		console.dir(this.state);
	}

	public render() {
		const className = `card ${this.state.editing ? 'editing' : '' } ${this.state.edited ? 'edited' : '' } ${this.props.type}`;

		return <article onClick={()=>this.EnableEditing()} className={className}>
				<header>{this.getContentElement()}</header>
				<ArticleEditForm
					id={this.props.typeOrder}
					{...this.state}
					link={this.state.link}
					comment={this.state.comment}
					onCancel={this.CancelInput.bind(this)}
					onSave={this.SaveData.bind(this)}
					type={this.props.type}
				/>
				<footer>
					<a className='button reset' onClick={ this.restoreOriginalContent.bind(this) }>Slett</a>
					<a className='button edit'>Rediger</a>
				</footer>
		</article>;
	}

	private getContentElement() {
		switch (this.props.type) {
			case 'title':
				return this.TitleElement();
			case 'lead':
				return this.LeadElement();
			case 'subtitle':
				return this.SubtitleElement();
			default:
				return this.ParagraphElement();
		}
	}

	private TitleElement() {
		return <div>
				<label>Tittel</label>
				<h1>{this.TextDiff()}</h1>
			</div>;
	}

	private SubtitleElement() {
		return <div>
				<label>Mellomtittel {this.props.typeOrder}</label>
				<h3>{this.TextDiff()}</h3>
			</div>;
	}

	private LeadElement() {
		return <div>
				<label>Innledning</label>
				<p>{this.TextDiff()}</p>
			</div>;
	}

	private ParagraphElement() {
		return <div>
				<label>Avsnitt {this.props.typeOrder}</label>
				<p>{this.TextDiff()}</p>
			</div>;
	}

	// TextDiff()
	// @param n/a
	// Caclulates and highlights the diff of two sentences.
	// Used to preview changes to the text done by the user.
	private TextDiff() : any {
		return textDiffToHTML(this.state.originalText, this.state.text);
	}

	// EnableEditing()
	// @param n/a
	// Changes the state for the component so correct css-classes are applied
	private EnableEditing() {
		if (!this.state.editing) {
			this.setState({
				editing: true,
			});
		}
	}

	// DisableEditing()
	// @param n/a
	// Changes the state for the component so correct css-classes are applied
	private DisableEditing() {
		if (this.state.editing) {
			this.setState({
				editing: false,
			});
		}
	}

	// restoreOriginalContent( e:any )
	// @param {event} e
	// Stops bubbeling then resets the parrent components state.
	// TODO: This should rerender the child,
	// however the child still seams to contain the initial data...
	private restoreOriginalContent(e : any) {
		console.log('restoreOriginalContent "%s"', this.state.originalText);

		e.stopPropagation();
		const state = Object.assign({}, {
			...this.state,
			edited: false,
			link: [],
			text: this.state.originalText,
			comment: '',
		});

		this.setState(state);
		this.DisableEditing();
	}

	// CancelInput()
	// @param n/a
	// Callback for childs onCancel funciton.
	private CancelInput(){
		this.DisableEditing();
	}

	// SaveData( state:object )
	// @param {state} state
	// Applies the submitted state (from the child component) to the parents state.
	// This is passed to the child as a prop and used as callback.
	private SaveData(fromState : ArticleEditFormState) {
		this.DisableEditing();

		this.setState({
			edited: true,
			text: fromState.text,
		});
	}

}
