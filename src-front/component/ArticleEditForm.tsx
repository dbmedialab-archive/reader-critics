import * as React from 'react';
import DynamicList from './../component/DynamicList';

interface ArticleProp {
	id: number;         // The ID of this item. It's used to create references for labels to text areas and inputs.
	onCancel: any;      // Funciton to trigger so input is reset
	onSave: any;        // Funciton to trigger so component's state is sent to parrent Article component
	text: string;       // The text of the element, be it title, paragraph, lead etc.
	comment: string;    // The users comment to this item. Sent as prop since Article component needs this when sending data
	link: Array<string> // List or links/references the user has added. These are needed på Article component
	type: string;       // The type of the content, e.g. title, subtitle, paraghrap etc.
}

interface ArticleState {
	text: string;        // All the input is stored in the components state
	comment : string;    // If the user cancles the state is reset to prop values
	link: Array<string>; // If the user stores the state is sent to Article component and stored in props.
}

// constants used as references in markup
let textArea:any, commentArea:any, linkInput:any

export default class ArticleEditForm extends React.Component<ArticleProp, any> {

	constructor (props:ArticleProp){
		super()
		this.state = { text: props.text,  comment: props.comment,  link:props.link }
	}

	public render(){
		return <form>
				<fieldset className="text">
					<label htmlFor={this.FieldId('content')}>rediger {this.Translate( this.props.type )}</label>
					<textarea onKeyUp={()=>this.UpdateState( "text", textArea )} ref={(r) => textArea = r} defaultValue={this.state.text} rows={3} id={this.FieldId('content')} />
				</fieldset>
				<fieldset className="comment">
					<label htmlFor={this.FieldId('comment')}>Legg til kommentar</label>
					<textarea onKeyUp={()=>this.UpdateState( "comment", commentArea )} ref={(r) => commentArea = r} defaultValue={this.state.comment} rows={3} id={this.FieldId('comment')}/>
				</fieldset>
				<fieldset className="link">
					<label htmlFor={this.FieldId('link')}>Legg til lenker</label>
					<DynamicList items={this.state.link} onRemove={this.RemoveLinkItem.bind(this)} />
					<input ref={(r) => linkInput = r} id={this.FieldId('link')} type="text" onKeyDown={(e)=> e.keyCode == 13 ? this.AddLinkItem(e) : null} />
				</fieldset>
				<fieldset className="actions">
					<a onClick={(e)=>this.onCancel(e)} className="button cancel">Avbryt</a>
					<a onClick={(e)=>this.onSave(e)} className="button save">Lagre</a>
				</fieldset>
			</form>
	}

	// UpdateState( field:string, ref:any )
	// Helper class to update the components state when inputing values in text areas.
	private UpdateState( field:string, ref:any ){
		const state = {}
		state[ field ] = ref.value;
		this.setState( state )
	}

	// FieldId( type:string )
	// @param {string} type
	// Helper class to create unique ID for lables in form.
	private FieldId( type:string ){
		return `edit-field-${this.props.id}-${type}`
	}

	// RemoveLinkItem( index:number )
	// @param {number} index
	// Removes the supplied index from the states link-list.
	// Component renders news state and gives each item a new index.
	private RemoveLinkItem( index:number ){
		let link = this.state.link
		this.setState({ link: [ ...link.slice( 0, index ), ...link.slice( index + 1 )] })
	}

	// onCacnel( e:any )
	// @param {event} e
	// Resets the components state to that of its initial props.
	// Clears inputfeilds and calls the onCancle funciton for the
	// parent component so it can collaps the edit feild.
	private onCancel(e:any){
		e.stopPropagation()
		this.setState({ text: this.props.text,  comment: this.props.comment,  link: this.props.link })
		commentArea.value = this.props.comment
		textArea.value = this.props.text
		this.props.onCancel( this.state )
	}

	// onSave( e:any )
	// @param {event} e
	// Takes an event so it can stop bubbling in the dom.
	// Adds the current input to the link feild
	// Triggers the parrent onSave method to update state.
	private onSave(e:any){
		e.stopPropagation()
		if( linkInput.value ) this.AddLinkItem()
		this.props.onSave( this.state )
	}

	// AddLinkItem( e?:any )
	// @param {event} e optional
	// Adds the content of the linkinput feild to the component link state
	// resets the input
	private AddLinkItem( e?:any ){
		if( e ) e.preventDefault()
		if( ! linkInput.value ) return
		this.setState({link:[...this.state.link, linkInput.value]})
		linkInput.value = ""
	}

	// UpdateState( field:string, ref:any )
	// Helper class to translate component type to native language.
	private Translate( type:string ){
		let lookup = {
			lead      : "innledning",
			title     : "tittel",
			paragraph : "avsnitt"
		}
		return lookup [ type ] ? lookup [ type ] : "tekst"
	}
}
