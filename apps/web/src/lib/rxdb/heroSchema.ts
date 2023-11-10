export const heroesSchema = {
	title: 'heroes',
	version: 0,
	primaryKey: 'id',
	type: 'object',
	properties: {
		id: {
			type: 'string',
			maxLength: 100 // <- the primary key must have set maxLength
		},
		name: {
			type: 'string'
		},
		color: {
			type: 'string'
		},
		createdAt: {
			type: 'date-time'
		},
		updatedAt: {
			type: 'date-time'
		}
	},
	required: ['color', 'name', 'id'],
	additionalProperties: true
};
