// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { gql, ApolloClient, InMemoryCache } from "@apollo/client";
import axios from "axios";
import path from "path";
const client = new ApolloClient({
	cache: new InMemoryCache(),
	uri: path.join(process.env.STRAPI_CLIENT, "/graphql"),
});

export default async (req, res) => {
	const uri = process.env.STRAPI_CLIENT;
	const client = new ApolloClient({
		cache: new InMemoryCache(),
		uri: new URL("graphql", uri),
	});

	const response = await client.query({
		query: gql`
			query GetParticipants {
				games {
					id
					left {
						name
					}
					right {
						name
					}
					datetime
					bets {
						participant {
							name
							initials
							id
						}
						betStatus
					}
				}
				participants {
					name
					initials
					id
				}
			}
		`,
	});
	console.log(response.data);
	res.json(response.data);
};
