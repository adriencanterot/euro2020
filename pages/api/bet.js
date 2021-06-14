// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { gql, ApolloClient, InMemoryCache } from "@apollo/client";
import axios from "axios";
import path from "path";
const client = new ApolloClient({
	cache: new InMemoryCache(),
	uri: path.join(process.env.STRAPI_CLIENT, "/graphql"),
});

const mutation = gql`
	mutation AddBet(
		$game: Game
		$participant: Participant
		$betStatus: String!
	) {
		createBet(
			input: {
				data: {
					betStatus: $betStatus
					participant: $participant
					game: $game
				}
			}
		) {
			bet {
				betStatus
			}
		}
	}
`;

export default async (req, res) => {
	console.log(process.env.NODE_ENV);
	const uri = process.env.STRAPI_CLIENT;

	const { game, participant, betStatus } = req.body;

	const response = await axios.post(
		"https://infinite-ridge-54689.herokuapp.com/bets",
		{
			game: game.id,
			participant: participant.id,
			betStatus,
		}
	);

	res.statusCode = 200;
	res.json = { status: "success!" };
	return res;
};
