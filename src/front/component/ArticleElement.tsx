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

export abstract class ArticleElement
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
		const {type} = this.props.item.order;
		return <ArticleEditForm
			id={type}
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

	protected abstract getContentElement() : JSX.Element;

	// Caclulates and highlights the diff of two sentences.
	// Used to preview changes to the text done by the user.
	protected textDiff(text1 : string = '', text2 : string) : any {
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
