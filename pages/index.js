import Head from "next/head";
import { Container, Heading } from "@chakra-ui/react";
import axios from "axios";
import useSWR, { mutate } from "swr";
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
import { Box, Badge, Center, Divider } from "@chakra-ui/react";
import { ApolloClient, gql, InMemoryCache } from "@apollo/client";

function showDate(dateString) {
	const date = new Date(dateString);
	const options = {
		weekday: "short",
		month: "short",
		day: "numeric",
		hour: "numeric",
	};
	return date.toLocaleDateString("fr-FR", options);
}

function isToday(someDate) {
	const today = new Date();
	return (
		someDate.getDate() == today.getDate() &&
		someDate.getMonth() == today.getMonth() &&
		someDate.getFullYear() == today.getFullYear()
	);
}

function StatusBadge(props) {
	const { game } = props;
	return (
		<>
			{game.left_score != undefined && (
				<Center>
					<Badge
						fontSize="lg"
						colorScheme="green"
						alignContent="center"
					>
						{game.left_score} - {game.right_score}
					</Badge>
				</Center>
			)}
			{game.left_score == undefined && (
				<Center>
					<Badge
						fontSize="xs"
						colorScheme="orange"
						alignContent="center"
					>
						{isToday(new Date(game.datetime)) && "Aujourd'hui"}
						{!isToday(new Date(game.datetime)) &&
							showDate(new Date(game.datetime))}
					</Badge>
				</Center>
			)}
		</>
	);
}

import Picker from "../components/picker";

const setPicked = async (game, participant, betStatus) => {
	const response = await axios.post("/api/bet", {
		game,
		participant,
		betStatus: betStatus,
	});
	if (response.status === 200) {
		mutate("/api/games");
	}
};

export default function Home() {
	const { data, error } = useSWR("/api/games", axios);
	if (error) {
		return <div>An error occured while fetching</div>;
	}
	if (!data) {
		return <div>Loading...</div>;
	}
	const { games, participants } = data.data;

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
						<Tr>
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
						</Tr>
					))}
				</Tbody>
			</Table>
		</Container>
	);
}
