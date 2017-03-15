import Sequelize from 'sequelize';

import Article from './models/Article';
import Organisation from './models/Organisation';
import Tag from './models/Tag';

var sequelize = new Sequelize('mysql://kildekritikk:secret123@localhost/kildekritikk');

const models = {
	Article: sequelize.import('article', Article),
	Organisation: sequelize.import('organisation', Organisation),
	Tag: sequelize.import('tag', Tag),
};

const objvalues = (obj) => Object.getOwnPropertyNames(obj)
//	.filter(key => obj.isEnumerable(key))
	.map(key => obj[key]);

//org.sync();
/*
console.dir(models.Organisation);

console.log();
console.log();

console.dir(models.Article);
*/

models.Tag.belongsTo(models.Article);

console.dir(models.Tag);

objvalues(models).forEach(model => model.sync({ force: true }));
