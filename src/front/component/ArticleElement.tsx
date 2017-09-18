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
	item: {
		order : {
			item : number;
			type : number;
		}
		type : ArticleItemType;
		originalText : string;
		href?: string;
		altText? : string;
	}
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
			text: props.item.originalText || props.item.altText,
		};
	}

	public getCurrentData() : FeedbackItem {
		const formData : EditFormPayload = this.references.editForm.getCurrentData();

		if (formData.text === this.props.item.originalText
			&& !formData.comment
			&& formData.links.length <= 0
		) {
			// If no input was made, return an empty result. The top handler will discard it later.
			return null;
		}

		if (formData.text === this.props.item.originalText) {
			// If the text wasn't changed, delete it before submitting
			formData.text = '';
		}

		return Object.assign({
			type: this.props.item.type,
			order: this.props.item.order,
		}, formData);
	}

	public render() : JSX.Element {
		const css = classnames('card', this.props.item.type, {
			editing: this.state.editing,
			edited: this.state.edited,
		});
		const {item} = this.props.item.order;
		return <article id={`article-el-${item}`} className={css}>
				<header>
					{ this.getContentElement() }
				</header>
				{ this.createEditForm() }
				<footer>
					{ this.state.edited && this.createResetButton() }
					{ this.createEditButton() }
				</footer>
		</article>;
	}

	private createEditForm() : JSX.Element {
		const typeOrder = this.props.item.order.type;
		return <ArticleEditForm
			id={typeOrder}
			ref={(i : any) => { this.references.editForm = i; }}
			originalText={this.state.text}
			onCancel={this.CancelInput.bind(this)}
			onSave={this.SaveData.bind(this)}
			type={this.props.item.type}
		/>;
	}

	private createResetButton() : JSX.Element {
		const {item} = this.props.item.order;
		const css = classnames('button', 'reset');
		return <a
			id={`btn-reset-${item}`}
			className={css}
			onClick={ this.restoreOriginalContent.bind(this) }
		>Slett</a>;
	}

	private createEditButton() : JSX.Element {
		const {item} = this.props.item.order;
		const css = classnames('button', 'edit');
		return <a
			id={`btn-edit-${item}`}
			className={css}
			onClick={ this.EnableEditing.bind(this) }
		>Rediger</a>;
	}

	private getContentElement() {
		switch (this.props.item.type) {
			case ArticleItemType.MainTitle:
				return this.MainTitleElement();
			case ArticleItemType.SubTitle:
				return this.SubTitleElement();

			case ArticleItemType.LeadIn:
				return this.LeadInElement();
			case ArticleItemType.SubHeading:
				return this.SubHeadingElement();
			case ArticleItemType.Paragraph:
				return this.ParagraphElement();

			case ArticleItemType.FeaturedImage:
				return this.FeaturedImageElement();
			case ArticleItemType.Figure:
				return this.FigureElement();
			case ArticleItemType.Link:
				return this.LinkElement();
		}
	}

	private MainTitleElement() {
		return <div>
			<label>Tittel</label>
			<h1>{this.TextDiff(this.props.item.originalText, this.state.text)}</h1>
		</div>;
	}

	private SubTitleElement() {
		return <div>
			<label>Tittel</label>
			<h2>{this.TextDiff(this.props.item.originalText, this.state.text)}</h2>
		</div>;
	}

	private LeadInElement() {
		return <div>
			<label>Innledning</label>
			<p>{this.TextDiff(this.props.item.originalText, this.state.text)}</p>
		</div>;
	}

	private FeaturedImageElement() {
		return <div>
			<label>Featured Image</label>
			{ this.props.item.href && <p><img src={this.props.item.href} width="100%"/></p> }
			<p>{this.TextDiff(this.props.item.altText, this.state.text)}</p>
		</div>;
	}

	private SubHeadingElement() {
		const typeOrder = this.props.item.order.type;
		return <div>
			<label>Mellomtittel #{typeOrder}</label>
			<h3>{this.TextDiff(this.props.item.originalText, this.state.text)}</h3>
		</div>;
	}

	private ParagraphElement() {
		const typeOrder = this.props.item.order.type;
		return <div>
			<label>Avsnitt #{typeOrder}</label>
			<p>{this.TextDiff(this.props.item.originalText, this.state.text)}</p>
		</div>;
	}

	private FigureElement() {
		const typeOrder = this.props.item.order.type;
		return <div>
			<label>Bilde #{typeOrder}</label>
			{this.props.item.href?
				<p><img src={this.props.item.href} width="100%"/></p>
			:null}
			<p>{this.TextDiff(this.props.item.altText, this.state.text)}</p>
		</div>;
	}

	private LinkElement() {
		const typeOrder = this.props.item.order.type;
		return <div>
			<label>Link #{typeOrder}</label>
			<p>{this.TextDiff(this.props.item.originalText, this.state.text)}</p>
		</div>;
	}

	// Caclulates and highlights the diff of two sentences.
	// Used to preview changes to the text done by the user.
	private TextDiff(text1 : string = '', text2 : string) : any {

		return text2 === undefined
			? text1
			: textDiffToHTML(text1, text2);
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
			text: this.props.item.originalText,
		});

		this.references.editForm.reset(this.props.item.originalText);
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
