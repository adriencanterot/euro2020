import {
	Button,
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	MenuItemOption,
	MenuGroup,
	MenuOptionGroup,
	MenuIcon,
	MenuCommand,
	MenuDivider,
} from "@chakra-ui/react";

import { Spinner } from "@chakra-ui/react";

import { useState, useEffect } from "react";

import { Flex, Spacer } from "@chakra-ui/react";
import { Avatar, AvatarBadge, AvatarGroup } from "@chakra-ui/react";

function checkBet(bets, value) {
	const filtered = bets.filter((bet) => bet.betStatus === value);
	if (filtered.length > 0) {
		return (
			<AvatarGroup size="sm" spacing="-2.5" colorScheme="teal">
				{filtered.map((bet) => (
					<Avatar
						key={bet.id}
						name={bet.participant.initials}
						getInitials={(s) => s}
					/>
				))}
			</AvatarGroup>
		);
	}
}

export function Picker({
	game,
	participants,
	value,
	setPicked,
	direction = "row",
}) {
	const [spinning, setSpinning] = useState(false);

	useEffect(() => {
		setSpinning(false);
	}, [game.bets.length]);

	return (
		<Flex direction={direction}>
			<Menu>
				{new Date(game.datetime) > Date.now() && (
					<MenuButton as={Button} size="sm">
						{spinning ? <Spinner size="xs" /> : "+"}
					</MenuButton>
				)}
				<MenuList>
					{participants.map((participant) => (
						<MenuItem
							onClick={() => {
								setSpinning(true);
								setPicked(game, participant, value);
							}}
							key={participant.id}
						>
							{participant.name}
						</MenuItem>
					))}
				</MenuList>
			</Menu>
			<div>{game.bets && checkBet(game.bets, value)}</div>
		</Flex>
	);
}

export default Picker;
