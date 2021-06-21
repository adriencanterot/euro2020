// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { createBet, getInitialState } from "../../lib/graphql";

export default async (req, res) => {
	const uri = process.env.STRAPI_CLIENT;

	const { game, participant, betStatus } = req.body;

	const response = await createBet(game, participant, betStatus);
	if (response) {
		res.json(response);
	}
};
