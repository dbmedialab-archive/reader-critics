import * as classnames from 'classnames';
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

	public render() : JSX.Element {
		const css = classnames('card', this.props.type, {
			editing: this.state.editing,
			edited: this.state.edited,
		});

		return <article className={css}>
				<header>
					{ this.getContentElement() }
				</header>
				{ this.createEditForm() }
				<footer>
					{ this.createResetButton() }
					{ this.createEditButton() }
				</footer>
		</article>;
	}

	private createEditForm() : JSX.Element {
		return <ArticleEditForm
			id={this.props.typeOrder}
			text={this.state.text}
			link={this.state.link}
			comment={this.state.comment}
			onCancel={this.CancelInput.bind(this)}
			onSave={this.SaveData.bind(this)}
			type={this.props.type}
		/>;
	}

	private createResetButton() : JSX.Element {
		const css = classnames('button', 'reset');
		return <a
			id={`btn-reset-${this.props.elemOrder}`}
			className={css}
			onClick={ this.restoreOriginalContent.bind(this) }
		>Slett</a>;
	}

	private createEditButton() : JSX.Element {
		const css = classnames('button', 'edit');
		return <a
			id={`btn-reset-${this.props.elemOrder}`}
			className={css}
			onClick={ this.EnableEditing.bind(this) }
		>Rediger</a>;
	}

	private getContentElement() {
		switch (this.props.type) {
			case 'title':
				return this.TitleElement();
			case 'lead':
				return this.LeadElement();
			case 'subtitle':
				return this.SubtitleElement();
			case 'figure':
				return this.FigureElement();
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
				<label>Mellomtittel #{this.props.typeOrder}</label>
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
				<label>Avsnitt #{this.props.typeOrder}</label>
				<p>{this.TextDiff()}</p>
			</div>;
	}

	private FigureElement() {
		return <div>
				<label>Bilde #{this.props.typeOrder}</label>
				<p>{this.state.text}</p>
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

		this.setState({
			edited: false,
			editing: false,
			link: [],
			text: this.props.text,
			comment: '',
		});
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
