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

import { Flex, Spacer } from "@chakra-ui/react";
import { Avatar, AvatarBadge, AvatarGroup } from "@chakra-ui/react";

function checkBet(bets, value) {
	const filtered = bets.filter((bet) => bet.betStatus === value);
	if (filtered.length > 0) {
		return (
			<AvatarGroup size="sm" spacing="-2.5" colorScheme="teal">
				{filtered.map((bet) => (
					<Avatar
						name={bet.participant.initials}
						getInitials={(s) => s}
					/>
				))}
			</AvatarGroup>
		);
	}
}

export function Picker({ game, participants, value, setPicked }) {
	return (
		<Flex>
			<Menu>
				<MenuButton as={Button} size="sm">
					+
				</MenuButton>
				<MenuList>
					{participants.map((participant) => (
						<MenuItem
							onClick={() => setPicked(game, participant, value)}
						>
							{participant.name}
						</MenuItem>
					))}
				</MenuList>
			</Menu>
			<Spacer />
			{game.bets && checkBet(game.bets, value)}
		</Flex>
	);
}

export default Picker;
