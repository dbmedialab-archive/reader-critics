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

import { Schema } from 'mongoose';

import UserRole from 'base/UserRole';

const UserSchema : Schema = new Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	role: {
		type: String,
		required: true,
		enum: Object.values(UserRole),
		default: UserRole.Normal,
	},
	password: {
		type: String,
		required: false,
		default: null,
		select: false,
	},
}, {
	toObject: {
		retainKeyOrder: true,
		transform: (doc : Document, converted : any) => {
			// Make sure the password hash is thrown away
			delete converted.password;
			return converted;
		},
	},
});

UserSchema.index({
	'name': 1,
}, {
	name: 'unique_name',
	unique: true,
});

UserSchema.index({
	'email': 1,
}, {
	name: 'unique_email',
	unique: true,
});

UserSchema.index({
	'role': 1,
}, {
	name: 'user_roles',
	sparse: true,
});

export default UserSchema;
