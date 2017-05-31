import * as React from 'react';

import DynamicList from '../component/DynamicList';

export interface EditFormPayload {
	text : string;
	comment : string;
	links: Array <string>;
}

interface ArticleEditFormProp {
	/** The ID of this item. It's used to create references for labels to text areas and inputs */
	id: number;
	/** Funciton to trigger so input is reset */
	onCancel: any;
	/** Funciton to trigger so component's state is sent to parrent Article component */
	onSave: any;
	/** The text of the element, be it title, paragraph, lead etc. */
	originalText: string;
	/** The user's comment to this item. Sent as prop since Article component needs this when sending data */
	// comment: string;
	/** List or links/references the user has added. These are needed på Article component */
	// link: Array<string>;
	/** The type of the content, e.g. title, subtitle, paraghrap etc */
	type: string;
}

interface ArticleEditFormState {
	current : EditFormPayload;
	previous : EditFormPayload;
	/** All the input is stored in the components state */
	// text: string;
	/** If the user cancels the state is reset to prop values */
	// comment : string;
	/** If the user stores the state is sent to Article component and stored in props */
	// link: Array<string>;
}

export default class ArticleEditForm extends React.Component <ArticleEditFormProp, ArticleEditFormState> {

	private textArea : any;
	private commentArea : any;
	private linkInput : any;

	constructor(props : ArticleEditFormProp) {
		super(props);

		const initial : EditFormPayload = {
			text: props.originalText,
			comment: '',
			links: [],
		};

		this.state = {
			current: initial,
			previous: initial,
		};
	}

	public reset(originalText : string) {
		console.log('ArticleEditForm.reset');
// 		this.setState({
// 			text: originalText,
// //			comment: '',
// 		});

		// this.textArea.value = originalText;
	}

	public render() {
		return <form>
			<fieldset className='text'>
				<label htmlFor={this.FieldId('content')}>rediger {this.Translate(this.props.type)}</label>
				<textarea
					onKeyUp={() => this.UpdateState('text', this.textArea)}
					ref={r => this.textArea = r}
					defaultValue={this.state.current.text}
					rows={3}
					id={this.FieldId('content')}
				/>
			</fieldset>
			<fieldset className='comment'>
				<label htmlFor={this.FieldId('comment')}>Legg til kommentar</label>
				<textarea
					onKeyUp={()=>this.UpdateState( 'comment', this.commentArea )}
					ref={r => this.commentArea = r}
					// defaultValue={this.state.comment}
					rows={3}
					id={this.FieldId('comment')}
				/>
			</fieldset>
			<fieldset className='link'>
				<label htmlFor={this.FieldId('link')}>Legg til lenker</label>
				<DynamicList
					items={this.state.current.links}
					onRemove={this.RemoveLinkItem.bind(this)}
				/>
				<input
					ref={(r) => this.linkInput = r}
					id={this.FieldId('link')}
					type='text'
					onKeyDown={(e)=> e.keyCode === 13 ? this.AddLinkItem(e) : null}
				/>
			</fieldset>
			<fieldset className='actions'>
				<a onClick={(e)=>this.onCancel(e)} className='button cancel'>Avbryt</a>
				<a onClick={(e)=>this.onSave(e)} className='button save'>Lagre</a>
			</fieldset>
		</form>;
	}

	// UpdateState( field:string, ref:any )
	// Helper class to update the components state when inputing values in text areas.
	private UpdateState(field : string, ref : any) {
		const state = {};
		state[ field ] = ref.value;
		this.setState( state );
	}

	// FieldId( type:string )
	// @param {string} type
	// Helper class to create unique ID for lables in form.
	private FieldId(type : string) {
		return `edit-field-${this.props.id}-${type}`;
	}

	// RemoveLinkItem( index:number )
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

	// onCacnel( e:any )
	// @param {event} e
	// Resets the components state to that of its initial props.
	// Clears inputfeilds and calls the onCancle funciton for the
	// parent component so it can collaps the edit feild.
	private onCancel(e : any) {
		e.stopPropagation();

		this.commentArea.value = this.state.previous.comment;
		this.textArea.value = this.state.previous.text;

		this.setState({
			current: this.state.previous,
		}, () => this.props.onCancel(this.state));
	}

	// onSave( e:any )
	// @param {event} e
	// Takes an event so it can stop bubbling in the dom.
	// Adds the current input to the link feild
	// Triggers the parrent onSave method to update state.
	private onSave(e : any) {
		e.stopPropagation();

		if (this.linkInput.value) {
			this.AddLinkItem();
		}

		console.log('onSave', this.props.onSave, this.state);
		this.props.onSave(this.state);
	}

	// AddLinkItem( e?:any )
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

		this.setState({
			current,
		}, () => {
			console.log('AddItem this=', this);
			this.linkInput.value = '';
		});
	}

	// Helper class to translate component type to native language.
	private Translate(type : string) {
		const lookup = {
			lead: 'innledning',
			title: 'tittel',
			paragraph: 'avsnitt',
		};

		return lookup [ type ] ? lookup [ type ] : 'tekst';
	}

}
