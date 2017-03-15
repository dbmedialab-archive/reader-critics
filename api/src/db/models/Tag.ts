import defaults from './sequelizeDefaults';

const options = Object.assign({}, defaults, {
	timestamps: false,
	indexes: [
		{
			primary: true,
			fields: ['tagtext', 'article_id'],
		}
	]
});

const Tag = (sequelize, DataTypes) => {
	return sequelize.define('tag', {
		tagtext: {
			type: DataTypes.STRING,
			allowNull: false,
		//	primaryKey: true,
		},
		/* article_id: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
			primaryKey: true,
		}, */
	}, options);
};

export default Tag;
