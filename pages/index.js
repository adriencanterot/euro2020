import Head from "next/head";
import { Container, Heading } from "@chakra-ui/react";
import useSWR, { mutate } from "swr";
import axios from "axios";
import { useState, useEffect } from "react";
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

	// useEffect(() => {
	// 	console.log(picked);
	// 	if (Object.keys(picked).length !== 0) {
	// 		const { game, participant, betStatus } = picked;
	// 		(async (game, participant, betStatus) => {
	// 			const response = await axios.post("/api/bet", {
	// 				game,
	// 				participant,
	// 				betStatus: betStatus,
	// 			});
	// 			console.log(response.data);
	// 			setState(response.data);
	// 		})(game, participant, betStatus);
	// 		setPicked({});
	// 	}
	// }, [picked]);

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
