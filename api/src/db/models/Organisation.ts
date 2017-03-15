import defaults from './sequelizeDefaults';

const Organisation = (sequelize, DataTypes) => {
	return sequelize.define('organisation', {
		uuid: {
			type: DataTypes.UUID,
			primaryKey: true,
			defaultValue: DataTypes.UUIDV4,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
	}, defaults);
};

export default Organisation;
