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

import { FormattedMessage } from 'react-intl';

import ArticleItemType from 'base/ArticleItemType';
import FeedbackItem from 'base/FeedbackItem';

import FeedbackContainer from 'front/feedback/FeedbackContainer';

import {
	default as ArticleEditForm,
	EditFormPayload,
} from 'front/component/ArticleEditForm';

import { diffToReactElem } from 'base/diff';

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
	},
	container : FeedbackContainer,
}

export interface ArticleElementState {
	edited: boolean;
	editing: boolean;
	text: string,
}

export abstract class ArticleElement
extends React.Component <ArticleElementProp, ArticleElementState>
{

	private editForm: ArticleEditForm;

	constructor(props : ArticleElementProp) {
		super(props);
		this.state = {
			edited: false,
			editing: false,
			text: props.item.originalText || props.item.altText,
		};
	}

	public getCurrentData() : FeedbackItem {
		if (!this.hasData()) {
			// If no input was made, return an empty result. The top handler will discard it later.
			return null;
		}

		const formData : EditFormPayload = this.editForm.getCurrentData();

		if (formData.text === this.props.item.originalText) {
			// If the text wasn't changed, delete it before submitting
			formData.text = '';
		}

		return Object.assign({
			type: this.props.item.type,
			order: this.props.item.order,
		}, formData);
	}

	public hasData() : boolean {
		const formData : EditFormPayload = this.editForm.getCurrentData();
		return (typeof formData.text === 'string' && formData.text !== this.props.item.originalText)
			|| formData.comment.length > 0
			|| formData.links.length > 0;
	}

	public render() : JSX.Element {
		const css = classnames('card', this.props.item.type, {
			editing: this.state.editing,
			edited: this.state.edited,
		});

		return <article id={`article-el-${this.props.item.order.item}`} className={css}>
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
		return <ArticleEditForm
			id={this.props.item.order.type}
			ref={(i : any) => { this.editForm = i; }}
			originalText={this.state.text}
			onCancel={this.cancelEditing.bind(this)}
			onSave={this.saveData.bind(this)}
			type={this.props.item.type}
		/>;
	}

	private createResetButton() : JSX.Element {
		const css = classnames('button', 'reset');
		return <a
			id={`btn-reset-${this.props.item.order}`}
			className={css}
			onClick={ this.restoreOriginalContent.bind(this) }
		>Slett</a>;
	}

	private createEditButton() : JSX.Element {
		const css = classnames('button', 'edit');
		return <a
			id={`btn-edit-${this.props.item.order}`}
			className={css}
			onClick={ this.startEditing.bind(this) }
		><FormattedMessage id="button.edit"/></a>;
	}

	protected abstract getContentElement() : JSX.Element;

	// Calculates and highlights the diff of two sentences.
	// Used to preview changes to the text done by the user.
	protected textDiff(text1 : string = '', text2 : string) : any {
		return text2 === undefined ? text1 : diffToReactElem(text1, text2);
	}

	// Changes the state for the component so correct css-classes are applied
	private startEditing() {
		if (!this.state.editing) {
			this.setState({
				editing: true,
			});
		}
	}

	// Callback for childs onCancel funciton.
	private cancelEditing(){
		if (this.state.editing) {
			this.setState({
				editing: false,
			}, () => this.props.container.onChange());
		}
	}

	// @param {state} state
	// Applies the submitted state (from the child component) to the parents state.
	// This is passed to the child as a prop and used as callback.
	private saveData(fromState : EditFormPayload) {
		this.setState({
			edited: true,
			editing: false,
			text: fromState.text,
		}, () => this.props.container.onChange());
	}

	// @param {event} e
	// Stops bubbeling then resets the parrent components state.
	private restoreOriginalContent(e : any) {
		this.editForm.reset(this.props.item.originalText);
		this.setState({
			edited: false,
			text: this.props.item.originalText,
		}, () => this.props.container.onChange());
	}

}
