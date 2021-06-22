import React from "react";
import Link from "next/link";
import Head from "next/head";
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

import { Link as ChakraLink } from "@chakra-ui/react";

import { Container, Heading, Center } from "@chakra-ui/react";

export default function Scores(props) {
	const { participants } = props;
	return (
		<Container maxW="container.xl">
			<Head>
				<title>Scores</title>
			</Head>
			<Center>
				<Heading as="h1" m={2}>
					Scores
				</Heading>
			</Center>
			<Center>
				<Link href="/">
					<ChakraLink>Match</ChakraLink>
				</Link>
				&nbsp;|&nbsp;
				<Link href="/scores">Scores</Link>
			</Center>

			<Table variant="simple">
				<Thead>
					<Tr>
						<Th isNumeric>#</Th>
						<Th>Participant</Th>
						<Th isNumeric>Paris Gagnés</Th>
						<Th isNumeric>Perdus</Th>
						<Th isNumeric>Joués</Th>
						<Th isNumeric>Ratio</Th>
					</Tr>
				</Thead>
				<Tbody>
					{participants.map((participant, index) => (
						<Tr bg={index === 0 ? "green.100" : ""}>
							<Td isNumeric>#{index + 1}</Td>
							<Td>{participant.name}</Td>
							<Td isNumeric>{participant.won}</Td>
							<Td isNumeric>{participant.lost}</Td>
							<Td isNumeric>{participant.played}</Td>
							<Td isNumeric>
								{Number.parseFloat(participant.ratio).toFixed(
									3
								) * 100}
								%
							</Td>
						</Tr>
					))}
				</Tbody>
			</Table>
		</Container>
	);
}

import { getParticipants } from "../lib/graphql";

export async function getServerSideProps(context) {
	const response = await getParticipants();

	const { participants } = response.data;
	console.log(participants);
	let participantsWithScore = [];
	for (let participant of participants) {
		let won = 0;
		let played = 0;
		let lost = 0;
		if (participant.bets === undefined) {
			continue;
		}
		for (let bet of participant.bets) {
			played += 1;
			if (bet.game.left_score === null || bet.game.right_score === null) {
				continue;
			}
			let gameStatus;
			if (bet.game.left_score > bet.game.right_score) {
				gameStatus = "Left";
			} else if (bet.game.left_score < bet.game.right_score) {
				gameStatus = "Right";
			} else {
				gameStatus = "Nil";
			}
			console.log(bet.game.left_score);
			if (bet.betStatus === gameStatus) {
				won += 1;
			} else {
				lost += 1;
			}
		}
		const ratio = won + lost !== 0 ? won / (won + lost) : 0;

		participantsWithScore.push({
			won,
			lost,
			played,
			ratio,
			...participant,
		});
	}
	const sortedParticipants = participantsWithScore.sort(
		(p1, p2) => p2.ratio / p1.ratio - 1
	);

	return {
		props: {
			participants: sortedParticipants,
		},
	};
}
