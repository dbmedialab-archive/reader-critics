const defaults = Object.freeze({
	underscored: true,
	freezeTableName: false,

	createdAt: 'created',
	updatedAt: 'updated',
});

const withDefaults = (options = {}) => Object.assign({}, defaults, options);

export default withDefaults;
