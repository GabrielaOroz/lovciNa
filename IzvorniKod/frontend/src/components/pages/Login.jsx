import { Box, Button, Flex, Input, InputGroup, InputRightElement, Show, Text } from "@chakra-ui/react";
import Base from "../Base";
import FormCard from "../FormCard";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GiDeerHead } from "react-icons/gi";

export default function Login() {
	const [showPass, setShowPass] = useState(false);
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	const navigate = useNavigate();

	const handleSubmit = () => {
		setError("");
		const data = {
			username,
			password,
		};
		console.log(data);

		if (!username || !password) {
			setError("Please fill out all the required fields.");
			return;
		} else {
			fetch("http://localhost:8000/auth/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			})
				.then((res) => {
					console.log(res);
					if (res.ok) {
						navigate("/start");
					} else {
						setError("Incorrect username or password.");
					}
				})
				.then((data) => console.log(data))
				.catch((err) => console.error(err));
		}
	};

	return (
		<Base>
			<FormCard>
				<Flex justifyContent="center" gap="10px" alignItems="center">
					<Show above="md">
						<GiDeerHead size="30px" color="green.700" />
					</Show>
					<Text fontSize="lg">
						Start using Wild Track
					</Text>
					<Show above="md">
						<GiDeerHead size="30px" color="green.700" />
					</Show>
				</Flex>

				<Input
					type="text"
					placeholder="Username"
					borderColor="green.700"
					focusBorderColor="green.700"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					id="username"
				/>
				<InputGroup size="md">
					<Input
						type={showPass ? "text" : "password"}
						placeholder="Enter password"
						borderColor="green.700"
						focusBorderColor="green.700"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						id="password"
					/>
					<InputRightElement width="4.5rem">
						<Button
							h="1.75rem"
							size="sm"
							bgColor="#F1EDD4"
							_hover={{ bg: "#F1EFD4" }}
							onClick={() => setShowPass(!showPass)}
						>
							{showPass ? "Hide" : "Show"}
						</Button>
					</InputRightElement>
				</InputGroup>

				<Text color="#CC0000">{error}</Text>

				<Button
					type="submit"
					colorScheme="green"
					color="#FFFBE0"
					border="solid 1px"
					w="100px"
					alignSelf="center"
					onClick={handleSubmit}
				>
					Log In
				</Button>

        <Flex direction="column">
          <Text alignSelf="center" color="black">
            Don't have an account?
            <Link to="/register">
              <Button paddingLeft="5px" variant="unstyled" color="green.700">
                Register
              </Button>
            </Link>
          </Text>
          <Text p="0" alignSelf="center" color="black">
            Log in as
            <Link to="/admin" >
              <Button paddingLeft="5px" variant="unstyled" color="green.700">
                Admin
              </Button>
            </Link>
          </Text>
        </Flex>
			</FormCard>
		</Base>
	);
}
