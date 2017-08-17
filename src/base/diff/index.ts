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

// The following two lines might be a bit confusing, but TypeScript really wants it that way:
import { DiffBit } from './diffString';
export { DiffBit } from './diffString';

export type DiffFormatterFunction = (result: DiffBit, index: number) => any;

export function diff (
	oldText : string,
	newText : string,
	formatter : DiffFormatterFunction
) : any
{

}
