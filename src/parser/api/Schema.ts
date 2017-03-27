const Schema = {
	'properties': {
		'site': {
			'name': 'string',
		},
		'article': {
			'modified_identifier': 'string',
			'title': 'string',
			'url': 'string',
			'updated_at': 'number',
			'elements': [
				{
					'type': 'string',
					'data': 'string',
					'order': 'number',
				},
			],
		},
		'byline': {
			'authors': {
				'name': 'string',
				'email': 'string',
			},
		},
		'tags': {
			'tagname': 'string',
		},
	},
	'required': ['site', 'article', 'byline'],
};

export default Schema;
