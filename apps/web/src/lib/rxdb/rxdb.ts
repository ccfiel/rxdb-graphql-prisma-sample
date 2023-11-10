import { RxDBCleanupPlugin } from 'rxdb/plugins/cleanup';
import { addRxPlugin } from 'rxdb';
import { RxDBLeaderElectionPlugin } from 'rxdb/plugins/leader-election';
import { heroesSchema } from './heroSchema';
addRxPlugin(RxDBLeaderElectionPlugin);
addRxPlugin(RxDBCleanupPlugin);

export const createDb = async () => {
	window.global = window;

	const { createRxDatabase } = await import('rxdb');
	const { getRxStorageDexie } = await import('rxdb/plugins/storage-dexie');

	const { RxDBDevModePlugin } = await import('rxdb/plugins/dev-mode');
	addRxPlugin(RxDBDevModePlugin);

	const db = await createRxDatabase({
		name: 'mydatabase',
		storage: getRxStorageDexie(),
		// storage: getRxStorageIndexedDB(),
		multiInstance: true,
		eventReduce: true,
		ignoreDuplicate: true,
		cleanupPolicy: {
			minimumDeletedTime: 1000 * 60 * 60 * 24 * 7, // 7 days,
			minimumCollectionAge: 1000 * 60, // 60 seconds
			runEach: 1000 * 60 * 5, // 5 minutes
			awaitReplicationsInSync: true,
			waitForLeadership: true
		}
	});
	if (!db.heroes) {
		await db.addCollections({
			heroes: {
				// @ts-ignore
				schema: heroesSchema
			}
		});
	}
	return db;
};

// export const replication = async (
// 	token: any,
// 	url: any,
// 	collection: any,
// 	pushQueryBuilder: any,
// 	pullQueryBuilder: any,
// 	streamPullBuilder: any
// ) => {
// 	/** For push and pull replication only */
// 	let isError = false;
// 	window.global = window;
// 	const replicator = await setupGraphQLReplication(
// 		collection,
// 		pushQueryBuilder,
// 		pullQueryBuilder,
// 		streamPullBuilder
// 	);
// 	if (replicator) {
// 		replicator.setHeaders({
// 			Authorization: JSON.stringify({
// 				token: `Bearer fe65d9a5-e5b2-43d4-90e7-86b2425ed943`,
// 			})
// 		});
// 		replicator.start();
// 		replicator.error$.subscribe((error) => {
// 			isError = true;
// 			console.log('Replication replication error', error);
// 		});
// 		return replicator;
// 	}

// };
