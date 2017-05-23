import * as React from 'react';

export default ({items, onRemove }:any) => <ol>
	{ items.map( ( item:string, index:number ) => <li onClick={() => onRemove( index )} key={index}>{`${item}`}</li> ) }
</ol>
