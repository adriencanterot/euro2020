import Head from "next/head";
import Link from "next/link";
import { Container, Heading, Center, VStack } from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import {
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	TableCaption,
} from "@chakra-ui/react";
import { Link as ChakraLink } from "@chakra-ui/react";
import Picker from "../components/picker";
import StatusBadge from "../components/StatusBadge";

export default function Home(props) {
	const [games, setGames] = useState(props.data.games);
	const [participants, setParticipants] = useState(props.data.participants);

	const setPicked = async (game, participant, betStatus) => {
		const response = await axios.post("/api/bet", {
			game,
			participant,
			betStatus: betStatus,
		});
		const { bet } = response.data.createBet;
		const newGames = games.map((g) => {
			if (g.id === bet.game.id) {
				g.bets.push(bet);
			}
			return g;
		});
		setGames(newGames);
	};

	return (
		<Container maxW="container.xl">
			<Head>
				<title>Euro 2020</title>
			</Head>
			<Center>
				<Heading as="h1" m={2}>
					Match
				</Heading>
			</Center>
			<Center m={2}>
				<Link href="/">Match</Link>
				&nbsp;|&nbsp;
				<Link href="/scores">
					<ChakraLink>Scores</ChakraLink>
				</Link>
			</Center>
			<Table variant="simple">
				<TableCaption>1er Tour</TableCaption>
				<Thead>
					<Tr>
						<Th>Pays</Th>
						<Th>Statut</Th>
						<Th isNumeric>Pays</Th>
						<Th>G</Th>
						<Th>Nul </Th>
						<Th isNumeric>G</Th>
					</Tr>
				</Thead>
				<Tbody>
					{games.map((game) => (
						<Tr key={game.id}>
							<Td>{game.left.name}</Td>
							<Td>
								<StatusBadge game={game} />
							</Td>
							<Td isNumeric textAlign="right">
								{game.right.name}
							</Td>
							<Td>
								<Picker
									participants={participants}
									value="Left"
									game={game}
									setPicked={setPicked}
									loading={false}
								/>
							</Td>

							<Td>
								{" "}
								<Picker
									participants={participants}
									value="Nil"
									game={game}
									setPicked={setPicked}
									loading={false}
								/>
							</Td>
							<Td>
								{" "}
								<Picker
									participants={participants}
									value="Right"
									game={game}
									setPicked={setPicked}
									loading={false}
								/>
							</Td>
						</Tr>
					))}
				</Tbody>
			</Table>
		</Container>
	);
}

import { getInitialState } from "../lib/graphql";

export async function getServerSideProps(context) {
	const response = await getInitialState();
	return {
		props: response,
	};
}
