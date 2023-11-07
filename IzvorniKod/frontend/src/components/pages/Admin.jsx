import {
	Box,
	Button,
	Card,
	Input,
	InputGroup,
	InputRightElement,
	Text,
} from "@chakra-ui/react";
import { useState } from "react";

export default function Admin() {
	const [password, setPassword] = useState("");
	const [showPass, setShowPass] = useState(false);

	const handleSubmit = () => {
		fetch("http://localhost:8000/auth/admin", {
			method: "POST",
			body: password,
		})
			.then((res) => res.json())
			.then((data) => {
				console.log(data);
				navigate("/admin-listOfUsers");
			})
			.catch((err) => console.error(err));
	};

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
				<Text
					fontSize={{ base: "20px", md: "30px", lg: "50px" }}
					paddingBottom="5px"
					alignSelf="center"
				>
					Welcome back ADMIN!
				</Text>
				<InputGroup size="md">
					<Input
						type={showPass ? "text" : "password"}
						placeholder="Enter password"
						_placeholder={{ color: "green.700" }}
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						id="password"
					/>
					<InputRightElement width="4.5rem">
						<Button
							h="1.75rem"
							size="sm"
							bgColor="#F1EDD4"
							_hover={{ bg: "green.700" }}
							onClick={() => setShowPass(!showPass)}
						>
							{showPass ? "Hide" : "Show"}
						</Button>
					</InputRightElement>
				</InputGroup>
				<Button
					shadow="dark-lg"
					marginTop="15px"
					marginBottom="20px"
					w={{ base: "80px", md: "150px", lg: "200px" }}
					alignSelf="center"
					colorScheme="green"
					onClick={handleSubmit}
					fontSize={{ base: "15px", md: "20px" }}
				>
					Log In
				</Button>
			</Card>
		</Box>
	);
}
