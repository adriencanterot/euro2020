import React from "react";
import Link from "next/link";
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
						<Th isNumeric>Participant</Th>
						<Th>Paris Gagnés</Th>
						<Th>Perdus</Th>
						<Th>Joués</Th>
						<Th>Ratio</Th>
					</Tr>
				</Thead>
				<Tbody>
					{participants.map((participant, index) => (
						<Tr bg={index === 0 ? "green.100" : ""}>
							<Td>{participant.name}</Td>
							<Td>{participant.won}</Td>
							<Td>{participant.lost}</Td>
							<Td>{participant.played}</Td>
							<Td>{participant.ratio}</Td>
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
			if (
				bet.game.left_score === undefined ||
				bet.game.right_score === undefined
			) {
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

			if (bet.betStatus === gameStatus) {
				won += 1;
			} else {
				lost += 1;
			}
		}
		const ratio = played !== 0 ? won / (won + lost) : 0;

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
