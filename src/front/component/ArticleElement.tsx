//
// LESERKRITIKK v2 (aka Reader Critics)
// Copyright (C) 2017 DB Medialab/Aller Media AS, Oslo, Norway
// https://github.com/dbmedialab/reader-critics/
//
// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.
//
// This program is distributed in the hope that it will be useful, but WITHOUT
// ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
// FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License along with
// this program. If not, see <http://www.gnu.org/licenses/>.
//

// tslint:disable max-file-line-count
import * as classnames from 'classnames';
import * as React from 'react';

import ArticleItemType from 'base/ArticleItemType';
import FeedbackItem from 'base/FeedbackItem';

import {
	default as ArticleEditForm,
	EditFormPayload,
} from 'front/component/ArticleEditForm';

import textDiffToHTML from './textDiffToHTML';

export interface ArticleElementProp {
	elemOrder : number;
	typeOrder : number;
	type : ArticleItemType;
	originalText : string;
}

export interface ArticleElementState {
	edited: boolean;
	editing: boolean;
	text: string;
}

export default class ArticleElement
extends React.Component <ArticleElementProp, ArticleElementState>
{

	private references: {
		editForm: ArticleEditForm;
	} = {
		editForm: null,
	};

	constructor(props : ArticleElementProp) {
		super();
		this.state = {
			edited: false,
			editing: false,
			text: props.originalText,
		};
	}

	public getCurrentData() : FeedbackItem {
		const formData : EditFormPayload = this.references.editForm.getCurrentData();

		if (formData.text === this.props.originalText
			&& !formData.comment
			&& formData.links.length <= 0
		) {
			// If no input was made, return an empty result. The top handler will discard it later.
			return null;
		}

		if (formData.text === this.props.originalText) {
			// If the text wasn't changed, delete it before submitting
			formData.text = '';
		}

		return Object.assign({
			type: this.props.type,

			order: {
				item: this.props.elemOrder,
				type: this.props.typeOrder,
			},
		}, formData);
	}

	public render() : JSX.Element {
		const css = classnames('card', this.props.type, {
			editing: this.state.editing,
			edited: this.state.edited,
		});

		return <article id={`article-el-${this.props.elemOrder}`} className={css}>
				<header>
					{ this.getContentElement() }
				</header>
				{ this.createEditForm() }
				<footer>
					{this.state.edited?this.createResetButton():null}
					{ this.createEditButton() }
				</footer>
		</article>;
	}

	private createEditForm() : JSX.Element {
		return <ArticleEditForm
			id={this.props.typeOrder}
			ref={(i : any) => { this.references.editForm = i; }}
			originalText={this.state.text}
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
			id={`btn-edit-${this.props.elemOrder}`}
			className={css}
			onClick={ this.EnableEditing.bind(this) }
		>Rediger</a>;
	}

	private getContentElement() {
		switch (this.props.type) {
			case ArticleItemType.MainTitle.toString():
				return this.MainTitleElement();
			case 'title':
				return this.SubTitleElement();

			case 'lead':
				return this.LeadInElement();
			case 'featured':
				return this.FeaturedImageElement();

			case 'subhead':
				return this.SubHeadingElement();
			case 'paragraph':
				return this.ParagraphElement();

			case 'figure':
				return this.FigureElement();
			case ArticleItemType.Link.toString():
				return this.LinkElement();
		}
	}

	private MainTitleElement() {
		return <div>
			<label>Tittel</label>
			<h1>{this.TextDiff()}</h1>
		</div>;
	}

	private SubTitleElement() {
		return <div>
			<label>Tittel</label>
			<h2>{this.TextDiff()}</h2>
		</div>;
	}

	private LeadInElement() {
		return <div>
			<label>Innledning</label>
			<p>{this.TextDiff()}</p>
		</div>;
	}

	private FeaturedImageElement() {
		return <div>
			<label>Featured Image</label>
			<p>{this.state.text}</p>
		</div>;
	}

	private SubHeadingElement() {
		return <div>
			<label>Mellomtittel #{this.props.typeOrder}</label>
			<h3>{this.TextDiff()}</h3>
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

	private LinkElement() {
		return <div>
			<label>Link #{this.props.typeOrder}</label>
			<p>{this.TextDiff()}</p>
		</div>;
	}

	// Caclulates and highlights the diff of two sentences.
	// Used to preview changes to the text done by the user.
	private TextDiff() : any {
		return this.state.text === undefined
			? this.props.originalText
			: textDiffToHTML(this.props.originalText, this.state.text);
	}

	// Changes the state for the component so correct css-classes are applied
	private EnableEditing() {
		if (!this.state.editing) {
			this.setState({
				editing: true,
			});
		}
	}

	// Changes the state for the component so correct css-classes are applied
	private DisableEditing() {
		if (this.state.editing) {
			this.setState({
				editing: false,
			});
		}
	}

	// @param {event} e
	// Stops bubbeling then resets the parrent components state.
	private restoreOriginalContent(e : any) {
		this.setState({
			edited: false,
			text: this.props.originalText,
		});

		this.references.editForm.reset(this.props.originalText);
	}

	// Callback for childs onCancel funciton.
	private CancelInput(){
		this.DisableEditing();
	}

	// @param {state} state
	// Applies the submitted state (from the child component) to the parents state.
	// This is passed to the child as a prop and used as callback.
	private SaveData(fromState : EditFormPayload) {
		this.DisableEditing();
		this.setState({
			edited: true,
			text: fromState.text,
		});
	}

}
