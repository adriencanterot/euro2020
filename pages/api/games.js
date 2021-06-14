// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { gql, ApolloClient, InMemoryCache } from "@apollo/client";
import axios from "axios";
import path from "path";
import { getInitialState } from "../../lib/graphql";
const client = new ApolloClient({
	cache: new InMemoryCache(),
	uri: path.join(process.env.STRAPI_CLIENT, "/graphql"),
});

export default async (req, res) => {
	const response = await getInitialState();
	res.json(response.data);
};
