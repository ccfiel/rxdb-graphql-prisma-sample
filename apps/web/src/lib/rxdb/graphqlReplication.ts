import { replicateGraphQL } from 'rxdb/plugins/replication-graphql';

export const replication = async (
	collection: any,
	pullQueryBuilder: any,
	pushQueryBuilder: any
) => {
	try {
		const replicationState = replicateGraphQL({
			replicationIdentifier: 'http://localhost:3001/',
			collection: collection,
			url: {
				http: 'http://localhost:3001/'
			},
			pull: {
				queryBuilder: pullQueryBuilder,
				modifier: (doc) => doc,
				dataPath: undefined,
				batchSize: 50
			},
			push: {
				queryBuilder: pushQueryBuilder,
				batchSize: 10,
				modifier: (doc) => doc
			},
			headers: {
				Authorization: 'Bearer fe65d9a5-e5b2-43d4-90e7-86b2425ed943'
			},
			deletedField: 'deleted',
			live: true,
			retryTime: 1000 * 5,
			waitForLeadership: true,
			autoStart: true
		});

		return replicationState;
	} catch (error) {
		console.log('setupPushGraphQLReplication', error);
	}
};
