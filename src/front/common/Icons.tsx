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

import * as React from 'react';

export interface IIcon {
	color?: string;
	width?: string;
	height?: string;
}

export const AlertIcon : React.StatelessComponent <IIcon> = (props : IIcon) => {
	const color = props.color || '#f44336',
		width = props.width || '56px',
		height = props.height || '56px';
	// tslint:disable-next-line
	return (<svg height={height} version="1.1" viewBox="0 0 16 16" width={width} xmlns="http://www.w3.org/2000/svg"><title/><defs/><g fill="none" fillRule="evenodd" id="Icons with numbers" stroke="none" strokeWidth="1"><g fill={color} id="Group" transform="translate(-96.000000, -432.000000)"><path d="M103,443 L103,445 L105,445 L105,443 Z M104,448 C99.5817218,448 96,444.418278 96,440 C96,435.581722 99.5817218,432 104,432 C108.418278,432 112,435.581722 112,440 C112,444.418278 108.418278,448 104,448 Z M103,435 L103,442 L105,442 L105,435 Z M103,435" id="Oval 208 copy"/></g></g></svg>);
};

export const SuccessIcon : React.StatelessComponent <IIcon> = (props : IIcon) => {
	const color = props.color || '#23af28',
		width = props.width || '56px',
		height = props.height || '56px';
	// tslint:disable-next-line
	return (<svg version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" id="icon_for_success" enableBackground="new 0 0 48 48" width={width} height={height}><title/><defs/><g id="Okay_icon"><path fill={color} d="M44,24c0,11.045-8.955,20-20,20S4,35.045,4,24S12.955,4,24,4S44,12.955,44,24z"/><path fill="#CCFF90" d="M34.602,14.602L21,28.199l-5.602-5.598l-2.797,2.797L21,33.801l16.398-16.402L34.602,14.602z"/></g></svg>);
};
