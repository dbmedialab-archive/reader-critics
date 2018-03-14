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

import * as React from 'react';

import { FormattedMessage } from 'react-intl';

import ArticleItemType from 'base/ArticleItemType';

import DynamicList from 'front/component/DynamicList';

export interface EditFormPayload {
	text : string;
	comment : string;
	links : string[];
}

export interface ArticleEditFormProp {
	// Numeric ID for creating references on sub components
	id : number;
	/// Handler function to reset all data to its unmodified, original state
	onCancel : Function;
	// Handler function to send the modified state to the parent component
	onSave : Function;
	/// The original, unmodified text of the element
	originalText: string;
	// The type of the content (title, subtitle, paragraph ...)
	type: ArticleItemType;
}

export interface ArticleEditFormState {
	current : EditFormPayload;
	initial : EditFormPayload;
}

export default class ArticleEditForm
extends React.Component <ArticleEditFormProp, ArticleEditFormState>
{
	private textArea : any;
	private commentArea : any;
	private linkInput : any;

	// To prevent hidden references to nested objects (esp. the "links" array),
	// define current/initial separately!
	private static readonly makeCleanState = (text : string) => ({
		current: {
			text,
			comment: '',
			links: [],
		},
		initial: {
			text,
			comment: '',
			links: [],
		},
	})

	constructor(props : ArticleEditFormProp) {
		super(props);
		this.state = ArticleEditForm.makeCleanState(props.originalText);
	}

	public reset(originalText : string) {
		this.setState(ArticleEditForm.makeCleanState(originalText), () => {
			if (this.textArea && this.commentArea) {
				this.textArea.value = originalText;
				this.commentArea.value = '';
			}
		});
	}

	public getCurrentData() : EditFormPayload {
		return this.state.current;
	}

	public render() {
		return <form>
			<fieldset className="text">
				<textarea
					onKeyUp={() => this.UpdateState('text', this.textArea)}
					ref={r => this.textArea = r}
					defaultValue={this.state.current.text}
					rows={3}
					id={this.makeID('content')}
				/>
			</fieldset>
			<fieldset className="comment">
				<label htmlFor={this.makeID('comment')}>
					<FormattedMessage id="label.add-comment"/>
				</label>
				<textarea
					onKeyUp={()=>this.UpdateState( 'comment', this.commentArea )}
					ref={r => this.commentArea = r}
					rows={3}
					id={this.makeID('comment')}
				/>
			</fieldset>
			<fieldset className="link">
				<label htmlFor={this.makeID('link')}><FormattedMessage id="label.add-links"/></label>
				<DynamicList
					items={this.state.current.links}
					onRemove={this.RemoveLinkItem.bind(this)}
				/>
				<input
					ref={(r) => this.linkInput = r}
					id={this.makeID('link')}
					type="text"
					onKeyDown={(e)=> e.keyCode === 13 ? this.AddLinkItem(e) : null}
				/>
			</fieldset>
			<fieldset className="actions">
				<a onClick={(e)=>this.onCancel(e)} className="button cancel">
					<FormattedMessage id="button.cancel"/>
				</a>
				<a onClick={(e)=>this.onSave(e)} className="button save">
					<FormattedMessage id="button.save"/>
				</a>
			</fieldset>
		</form>;
	}

	// Helper class to update the components state when inputing values in text areas.
	private UpdateState(field : string, ref : any) {
		const newState = this.state;
		newState.current[field] = ref.value;
		this.setState(newState);
	}

	// @param {string} type
	// Helper class to create unique ID for lables in form.
	private makeID(type : string) {
		return `edit-field-${this.props.id}-${type}`;
	}

	// @param {event} e optional
	// Adds the content of the linkinput feild to the component link state
	// resets the input
	private AddLinkItem(e? : any) {
		if (e) {
			e.preventDefault();
		}
		if (!this.linkInput.value) {
			return false;
		}

		const current : EditFormPayload = this.state.current;
		current.links.push(this.linkInput.value);

		this.setState({
			current,
		}, () => {
			this.linkInput.value = '';
		});
	}

	// @param {number} index
	// Removes the supplied index from the states link-list.
	// Component renders news state and gives each item a new index.
	private RemoveLinkItem(index : number) {
		const link = this.state.current.links;
		const current : EditFormPayload = this.state.current;

		current.links = [ ...link.slice( 0, index ), ...link.slice( index + 1 )];

		this.setState({
			current,
		});
	}

	// @param {event} e
	// Resets the components state to that of its initial props.
	// Clears inputfeilds and calls the onCancle funciton for the
	// parent component so it can collaps the edit feild.
	private onCancel(e : any) {
		e.stopPropagation();

		this.textArea.value = this.state.initial.text;
		this.commentArea.value = this.state.initial.comment;

		this.setState({
			current: Object.assign({}, this.state.initial),
		}, () => {
			this.props.onCancel(this.state);
		});
	}

	// @param {event} e
	// Takes an event so it can stop bubbling in the dom.
	// Adds the current input to the link feild
	// Triggers the parrent onSave method to update state.
	private onSave(e : any) {
		e.stopPropagation();

		if (this.linkInput.value) {
			this.AddLinkItem();
		}

		this.props.onSave(this.state.current);
	}

}
