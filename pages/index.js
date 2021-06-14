import Head from "next/head";
import { Container, Heading } from "@chakra-ui/react";
import axios from "axios";
import {
	Table,
	Thead,
	Tbody,
	Tfoot,
	Tr,
	Th,
	Td,
	TableCaption,
} from "@chakra-ui/react";
import { ApolloClient, gql, InMemoryCache } from "@apollo/client";

import Picker from "../components/picker";

const setPicked = (game, participant, betStatus) => {
	axios.post("/api/bet", {
		game,
		participant,
		betStatus: betStatus,
	});
};

export default function Home({ games, participants }) {
	console.log(participants);

	return (
		<Container maxW="container.xl">
			<Head>
				<title>Euro 2020</title>
			</Head>
			<Heading as="h1">Liste des Match</Heading>
			<Table variant="simple">
				<TableCaption>1er Tour</TableCaption>
				<Thead>
					<Tr>
						<Th>Date</Th>
						<Th>Pays</Th>
						<Th>G</Th>
						<Th>Nul </Th>
						<Th isNumeric>G</Th>
						<Th isNumeric>Pays</Th>
					</Tr>
				</Thead>
				<Tbody>
					{games.map((game) => (
						<Tr>
							<Td>date</Td>
							<Td>{game.left.name}</Td>
							<Td>
								<Picker
									participants={participants}
									value="Left"
									game={game}
									setPicked={setPicked}
								/>
							</Td>
							<Td>
								{" "}
								<Picker
									participants={participants}
									value="Nil"
									game={game}
									setPicked={setPicked}
								/>
							</Td>
							<Td>
								{" "}
								<Picker
									participants={participants}
									value="Right"
									game={game}
									setPicked={setPicked}
								/>
							</Td>
							<Td>{game.right.name}</Td>
						</Tr>
					))}
				</Tbody>
			</Table>
		</Container>
	);
}

export async function getServerSideProps(props) {
	const uri = process.env.STRAPI_CLIENT;
	const client = new ApolloClient({
		cache: new InMemoryCache(),
		uri: new URL("graphql", uri),
	});

	const axiosresp = await axios.get(new URL("participants", uri).toString());
	console.log(axiosresp);

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

	const { games, participants } = response.data;
	return {
		props: {
			games,
			participants,
		},
	};
}
