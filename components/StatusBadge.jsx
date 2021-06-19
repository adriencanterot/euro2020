import { Center, Badge } from "@chakra-ui/react";

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

function showTime(dateString) {
	const date = new Date(dateString);
	return date.getHours() + "H";
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
						m={2}
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
						m={2}
					>
						{isToday(new Date(game.datetime)) &&
							"Aujourd'hui à " + showTime(game.datetime)}
						{!isToday(new Date(game.datetime)) &&
							showDate(new Date(game.datetime))}
					</Badge>
				</Center>
			)}
		</>
	);
}

export default StatusBadge;
