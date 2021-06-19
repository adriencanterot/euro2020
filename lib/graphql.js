import { gql, ApolloClient, InMemoryCache } from "@apollo/client";
import QUERY_INITIAL_STATE from "./queries/queryInitialState.gql";
import CREATE_BET from "./queries/createBet.gql";
import QUERY_PARTICIPANTS from "./queries/queryParticipants.gql";
const uri = process.env.STRAPI_CLIENT;

const cache = new InMemoryCache({
	resultCaching: false,
});
const client = new ApolloClient({
	cache,
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

export async function getParticipants() {
	const response = await client.query({
		query: QUERY_PARTICIPANTS,
	});
	return response;
}
