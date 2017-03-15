import defaults from './sequelizeDefaults';

const options = Object.assign({}, defaults, {
	updatedAt: false,
});

console.dir(options);

const Article = (sequelize, DataTypes) => {
	return sequelize.define('article', {
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			allowNull: false,
			primaryKey: true,
		},
		url: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			isUrl: true,
		},
	}, options);
};

export default Article;
