import { DataTypes, Sequelize } from 'sequelize';

import withDefaults from './defaults';

const Author = (sequelize: Sequelize, types: DataTypes) => {
	return sequelize.define('author', {
		id: {
			type: types.INTEGER.UNSIGNED,
			autoIncrement: true,
			allowNull: false,
			primaryKey: true,
		},
		full_name: {
			type: types.STRING,
			allowNull: false,
		},
	}, withDefaults());
};

export default Author;
