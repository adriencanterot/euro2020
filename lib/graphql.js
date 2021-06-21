import { print as printGQL } from "graphql";
import axios from "axios";
import QUERY_INITIAL_STATE from "./queries/queryInitialState.gql";
import CREATE_BET from "./queries/createBet.gql";
import QUERY_PARTICIPANTS from "./queries/queryParticipants.gql";
import QUERY_CHECK_BET from "./queries/checkBet.gql";
import UPDATE_BET from "./queries/updateBet.gql";
const uri = process.env.STRAPI_CLIENT;

const urlString = new URL("graphql", uri).toString();

export async function getInitialState() {
	// 	const response = await client.query({
	// 		query: QUERY_INITIAL_STATE,
	// 	});

	const response = await axios.post(new URL("graphql", uri).toString(), {
		query: printGQL(QUERY_INITIAL_STATE),
	});

	return response;
}

export async function createBet(game, participant, betStatus) {
	const checkBet = await axios.post(urlString, {
		query: printGQL(QUERY_CHECK_BET),
		variables: { game: game.id, participant: participant.id },
	});

	let response;

	const noExistingBet = checkBet.data.data.bets.length === 0;
	console.log(checkBet.data.data.bets.length);

	if (noExistingBet) {
		response = await axios.post(urlString, {
			query: printGQL(CREATE_BET),
			variables: {
				betStatus,
				participant: participant.id,
				game: game.id,
			},
		});
		return response.data.data.createBet;
	} else {
		const firstExistingBetId = checkBet.data.data.bets[0].id;
		response = await axios.post(urlString, {
			query: printGQL(UPDATE_BET),
			variables: {
				bet: firstExistingBetId,
				betStatus: betStatus,
			},
		});
		return response.data.data.updateBet;
	}
}

export async function getParticipants() {
	const response = await axios.post(urlString, {
		query: printGQL(QUERY_PARTICIPANTS),
	});
	return response.data;
}
