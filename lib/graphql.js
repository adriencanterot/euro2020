import { gql, ApolloClient, InMemoryCache } from "@apollo/client";
import QUERY_INITIAL_STATE from "./queries/queryInitialState.gql";
import CREATE_BET from "./queries/createBet.gql";
const uri = process.env.STRAPI_CLIENT;
const client = new ApolloClient({
	cache: new InMemoryCache(),
	uri: new URL("graphql", uri),
});

export async function getInitialState() {
	const response = await client.query({
		query: QUERY_INITIAL_STATE,
	});

	return response;
}

export async function createBet(game, participant, betStatus) {
	const response = await client.mutate({
		mutation: CREATE_BET,
		variables: { betStatus, participant: participant.id, game: game.id },
	});

	return response;
}
