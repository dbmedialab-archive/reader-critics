import { DataTypes, Sequelize } from 'sequelize';

import withDefaults from './defaults';

/*
 What was learned from this structure?
 - Due to the lazy initialization of all the Models (modularization forces this)
 the model in a "reference" can only be applied with its name, not its actual
 instance. The resolution will take place when the models are finally created.
 This also means that TS cannot take care of a valid connection between objects
 here.
 - Do not create a primary index in "options", the third parameter of define().
 Omitting the "primaryKey: true" on the fields and then defining the index will
 end you up with a unique index, even though you forced it with primaryKey=true.
 Omitting the "primaryKey: true" completely will create an "id" field with
 autoincrement as the primary key.
 Well thanks, but that also is NOT what I want!
*/

const ArticleTag = (sequelize: Sequelize, types: DataTypes) => {
	return sequelize.define('article_tag', {
		article_id: {
			type: types.INTEGER.UNSIGNED,
			allowNull: false,
			primaryKey: true,
			references: {
				model: 'article',  // Need to reference the model by name, because the instance does not exist yet
				key: 'id',
			},
		},
		tag_txt: {
			type: types.STRING,
			allowNull: false,
			primaryKey: true,
		},
	}, withDefaults({
		timestamps: false,
	}));
};

export default ArticleTag;
