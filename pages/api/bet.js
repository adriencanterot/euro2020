// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { gql, ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
	cache: new InMemoryCache(),
	uri: "http://localhost:1337/graphql",
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
	console.log(req.body);

	const { game, participant, betStatus } = req.body;

	const response = await client.mutate({
		mutation,
		variables: { game, participant, betStatus },
		errorPolicy: "all",
	});

	console.log("okay");
	console.log(response);

	res.statusCode = 200;
	res.json = { status: "success!" };
};
