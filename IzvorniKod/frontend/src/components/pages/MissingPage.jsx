import { Box, Card, Text } from "@chakra-ui/react";

export default function MissingPage() {
	return (
		<Box bgImage="url(/dark-forest.jpg)" bgPosition="center" bgSize="contain" minH="100vh" paddingTop="20rem">
			<Card
				padding="15px"
				w={{ base: "300px", md: "300px", lg: "300px" }}
				alignSelf="center"
				background="#4a5242"
				color="black"
				boxShadow="dark-lg"
				margin="0 auto"
				fontWeight="bold"
				textAlign="center"
			>
				<Text>Invalid link</Text>
				<Text>You got lost in the woods</Text>
			</Card>
		</Box>
	);
}
