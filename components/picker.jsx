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

function checkBet(bets, value) {
	const filtered = bets.filter((bet) => bet.betStatus === value);
	if (filtered.length > 0) {
		return (
			<ul>
				{filtered.map((bet) => (
					<li>{bet.participant.initials}</li>
				))}
			</ul>
		);
	}
}

export function Picker({ game, participants, value, setPicked }) {
	return (
		<>
			{game.bets && checkBet(game.bets, value)}
			<Menu>
				<MenuButton as={Button}>+</MenuButton>
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
		</>
	);
}

export default Picker;
