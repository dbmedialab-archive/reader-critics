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

import DynamicList from 'front/component/DynamicList';

export interface EditFormPayload {
	text : string;
	comment : string;
	links : Array <string>;
}

export interface ArticleEditFormProp {
	/** The ID of this item. It's used to create references for labels to text areas and inputs */
	id : number;
	/** Funciton to trigger so input is reset */
	onCancel : Function;
	/** Funciton to trigger so component's state is sent to parrent Article component */
	onSave : Function;
	/** The text of the element, be it title, paragraph, lead etc. */
	originalText: string;
	/** The type of the content, e.g. title, subtitle, paraghrap etc */
	type: string;
}

export interface ArticleEditFormState {
	current : EditFormPayload;
	previous : EditFormPayload;
}

export default class ArticleEditForm
extends React.Component <ArticleEditFormProp, ArticleEditFormState>
{
	private textArea : any;
	private commentArea : any;
	private linkInput : any;

	constructor(props : ArticleEditFormProp) {
		super(props);
		this.state = {
			current : {
				text: props.originalText,
				comment: '',
				links: [],
			},
			previous : {
				text: props.originalText,
				comment: '',
				links: [],
			},
		};
	}

	public getCurrentData() : EditFormPayload {
		return this.state.current;
	}

	public reset(originalText : string) {
		this.textArea.value = originalText;
		this.commentArea.value = '';
		this.linkInput.value = '';

		this.setState({
			current: {
				text: originalText,
				comment: '',
				links: [],
			},
			previous: {
				text: originalText,
				comment: '',
				links: [],
			},
		});
	}

	public render() {
		return <form>
			<fieldset className="text">
				<label htmlFor={this.FieldId('content')}>rediger {this.Translate(this.props.type)}</label>
				<textarea
					onKeyUp={() => this.UpdateState('text', this.textArea)}
					ref={r => this.textArea = r}
					defaultValue={this.state.current.text}
					rows={3}
					id={this.FieldId('content')}
				/>
			</fieldset>
			<fieldset className="comment">
				<label htmlFor={this.FieldId('comment')}>Legg til kommentar</label>
				<textarea
					onKeyUp={()=>this.UpdateState( 'comment', this.commentArea )}
					ref={r => this.commentArea = r}
					// defaultValue={this.state.comment}
					rows={3}
					id={this.FieldId('comment')}
				/>
			</fieldset>
			<fieldset className="link">
				<label htmlFor={this.FieldId('link')}>Legg til lenker</label>
				<DynamicList
					items={this.state.current.links}
					onRemove={this.RemoveLinkItem.bind(this)}
				/>
				<input
					ref={(r) => this.linkInput = r}
					id={this.FieldId('link')}
					type="text"
					onKeyDown={(e)=> e.keyCode === 13 ? this.AddLinkItem(e) : null}
				/>
			</fieldset>
			<fieldset className="actions">
				<a title="Avbryt" onClick={(e)=>this.onCancel(e)} className="button cancel">Avbryt</a>
				<a title="Lagre" onClick={(e)=>this.onSave(e)} className="button save">Lagre</a>
			</fieldset>
		</form>;
	}

	// Helper class to update the components state when inputing values in text areas.
	private UpdateState(field : string, ref : any) {
		const {current, previous} = this.state;
		console.log(current.text, previous.text);
		current[field] = ref.value;
		console.log(current.text, previous.text);

		const newState = {
			current,
			previous,
		};
		this.setState(newState);
	}

	// @param {string} type
	// Helper class to create unique ID for lables in form.
	private FieldId(type : string) {
		return `edit-field-${this.props.id}-${type}`;
	}

	// @param {event} e
	// Resets the components state to that of its initial props.
	// Clears inputfeilds and calls the onCancle funciton for the
	// parent component so it can collaps the edit feild.
	private onCancel(e : any) {
		e.stopPropagation();
		const {current, previous} = this.state;

		current.text = previous.text;
		current.comment = previous.comment;
		//for correct current and previous links working
		current.links = [...previous.links];

		this.textArea.value = previous.text;
		this.commentArea.value = previous.comment;
		this.linkInput.value = '';

		this.setState({
			current: current,
		}, () => this.props.onCancel(this.state));
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
		const {current, previous} = this.state;
		previous.text = current.text;
		previous.comment = current.comment;
		previous.links = current.links;
		this.props.onSave(this.state.current);
	}

	// @param {event} e optional
	// Adds the content of the linkinput feild to the component link state
	// resets the input
	private AddLinkItem(e? : any) {
		if (e) {
			e.preventDefault();
		}
		if (!this.linkInput.value) {
			return;
		}

		const current : EditFormPayload = this.state.current;
		current.links.push(this.linkInput.value);
		console.log(current.links);
		console.log(this.state.previous.links);
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

		// TODO do this with Array.splice() instead
		current.links = [ ...link.slice( 0, index ), ...link.slice( index + 1 )];

		this.setState({
			current,
		});
	}

	// Helper to translate component type to native language.
	private Translate(type : string) {
		const lookup = {
			lead: 'innledning',
			title: 'tittel',
			paragraph: 'avsnitt',
		};

		return lookup [ type ] ? lookup [ type ] : 'tekst';
	}

}
