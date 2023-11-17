import { Card, FormControl } from "@chakra-ui/react";
export default function Form({ children }) {
	return (
		<Card
			padding="30px"
			w={{ base: "300px", md: "400px", lg: "500px" }}
			marginTop="20px"
			alignSelf="center"
			background="#f9f7e8"
			color="#174134"
			boxShadow="dark-lg"
		>
			<FormControl display="flex" flexDirection="column" gap="20px">
				{children}
			</FormControl>
		</Card>
	);
}
