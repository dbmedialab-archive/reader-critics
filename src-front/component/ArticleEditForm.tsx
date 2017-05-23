import * as React from 'react';
import DynamicList from './../component/DynamicList';

interface ArticleProp {
	id: number;
	onCancel: any;
	onSave : any;
	text : string;
	comment : string;
	link : Array<string>
	type: string;
}

interface ArticleState {
	text: string;
	comment : string;
	link: Array<string>;
}

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

	private UpdateState( field:string, ref:any ){
		const state = {}
		state[ field ] = ref.value;
		this.setState( state )
	}

	private FieldId( type:string ){
		return `edit-field-${this.props.id}-${type}`
	}

	private RemoveLinkItem( index:number ){
		let link = this.state.link
		this.setState({ link: [ ...link.slice( 0, index ), ...link.slice( index + 1 )] })
	}

	private onCancel(e:any){
		e.stopPropagation()
		this.setState({ text: this.props.text,  comment: this.props.comment,  link: this.props.link })
		commentArea.value = this.props.comment
		textArea.value = this.props.text
		this.props.onCancel()
	}

	private onSave(e:any){
		e.stopPropagation()
		if( linkInput.value ) this.AddLinkItem()
		this.props.onSave( this.state )
	}

	private AddLinkItem( e?:any ){
		if( e ) e.preventDefault()
		if( ! linkInput.value ) return
		this.setState({link:[...this.state.link, linkInput.value]})
		linkInput.value = ""
	}

	private Translate( type:string ){
		let lookup = {
			lead      : "innledning",
			title     : "tittel",
			paragraph : "avsnitt"
		}
		return lookup [ type ] ? lookup [ type ] : "tekst"
	}
}
