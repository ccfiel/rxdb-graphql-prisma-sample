export const pullHeroQueryBuilder = (checkpoint: { id: string; updatedAt: number }, limit: any) => {
	if (!checkpoint) {
		checkpoint = {
			id: '',
			updatedAt: 0
		};
	}

	const query = `query PullHero($limit: Int!, $checkpoint: CheckpointInputType!) {
        pullHero(limit: $limit, checkpoint: $checkpoint) {
          checkpoint {
            id
            updatedAt
          }
          documents {
            color
            deleted
            id
            name
            updatedAt
            createdAt
          }
        }
      }`;
	return {
		query,
		variables: {
			checkpoint: checkpoint,
			limit: limit
		}
	};
};

export const pushHeroQueryBuilder = (pushRow: any) => {
	console.log('pushRow:', pushRow);
	const query = `
    mutation PushHero($row: [HeroInputPushRowInputType!]!) {
      pushHero(heroPushRow: $row) {
        id
        name
        color
        deleted
        updatedAt
        createdAt
      }
    }
    `;
	const variables = {
		row: pushRow
	};
	return {
		query: query,
		variables: variables
	};
};
