// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import axios from "axios";
import path from "path";
import { getInitialState } from "../../lib/graphql";

export default async (req, res) => {
	const response = await getInitialState();
	res.json(response.data);
};
