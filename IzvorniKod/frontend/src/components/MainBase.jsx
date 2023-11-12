import { Box, Card, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Flex, Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export default function MainBase({ children }) {
	return (
		<Box
			bgImage="url(/forest.jpg)"
			bgPosition="center"
			minH="100vh"
			display="flex"
			flexDirection="column"
			//justifyContent="space-between"
			padding="20px"
		>
			<Card
				background="#f9f7e8"
				w={{ base: "400px", md: "800px", lg: "1200px" }}
				alignSelf="center"
				padding="10px"
				paddingLeft="20px"
				paddingRight="20px"
				border="2px solid gray"
			>
				<Flex justifyContent="space-between">
					<Breadcrumb separator=" " color="green.700">
						<BreadcrumbItem>
							<BreadcrumbLink href="/start">Home</BreadcrumbLink>
						</BreadcrumbItem>

						<BreadcrumbItem>
							<BreadcrumbLink href="/">About</BreadcrumbLink>
						</BreadcrumbItem>
					</Breadcrumb>
					<Button colorScheme="teal" variant="link">
						<Link to="/login">Logout</Link>
					</Button>
				</Flex>
			</Card>
			<Card
				background="#f9f7e8"
				w={{ base: "400px", md: "800px", lg: "1200px" }}
				alignSelf="center"
				margin="10px"
				padding="20px"
			>
				{children}
			</Card>
		</Box>
	);
}
