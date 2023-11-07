import { Text, Card, Box, Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export default function Confirm() {
	return (
		<Box
			bgImage="url(/forest.jpg)"
			bgPosition="center"
			minH="100vh"
			display="flex"
			justifyContent="center"
		>
			<Card
				w={{ base: "300px", md: "600px", lg: "800px" }}
				background="#f9f7e8"
				alignSelf="center"
				padding="20px"
			>
				<Text fontSize="3rem" alignSelf="center">
					Account verification
				</Text>
				<Text alignSelf="center">
					A confirmation link has been sent to your email.{" "}
				</Text>
				<Text alignSelf="center">
					Check your email, confirm registration and log in.
				</Text>
				<Button shadow="dark-lg" size="lg" m="20px" w="200px" alignSelf="center" colorScheme="green">
                    <Link to="/login">Log In</Link>
				</Button>
				
			</Card>
		</Box>
	);
}