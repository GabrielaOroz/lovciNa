import {
	Box,
	Button,
	Card,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Text,
	useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

export default function ListOfUsers() {
	const [registeredUsers, setRegisteredUsers] = useState(null);
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const changeFirstName = (e) => {
		setFirstName(e.target.value);
	};
	const changeLastName = (e) => {
		setLastName(e.target.value);
	};
	const changeUsername = (e) => {
		setUsername(e.target.value);
	};
	const changeEmail = (e) => {
		setEmail(e.target.value);
	};
	const changePassword = (e) => {
		setPassword(e.target.value);
	};

	const handleSubmit = () => {
		const newData = {
			firstName,
			lastName,
			username,
			email,
			password,
		};
		console.log(newData);

		fetch("http://localhost:8000/admin/newInfo", {
			method: "POST",
			body: JSON.stringify(newDsata),
			mode: "no-cors",
		})
			.then((res) => res.json())
			.then((data) => {
				console.log(data);
				navigate("/confirm");
			})
			.catch((err) => console.error(err));
	};

  /*
	const fakeData = [
		{
			id: 1,
			role: "Tracker",
			firstName: "John",
			lastName: "Doe",
			email: "johndoe@email.com",
			username: "johndoe123",
			password: "jdP!ssw0rd",
		},
		{
			id: 2,
			role: "Researcher",
			firstName: "Alice",
			lastName: "Johnson",
			email: "alicejohnson@email.com",
			username: "alicej",
			password: "Alic3P!ss",
		},
		{
			id: 3,
			role: "Manager",
			firstName: "Michael",
			lastName: "Smith",
			email: "michaelsmith@email.com",
			username: "mikesmith",
			password: "SmithyP!55",
		},
	];*/

	const { isOpen, onOpen, onClose } = useDisclosure();

	useEffect(() => {
		fetch("http://localhost:8000/admin/registeredUsers", {
			method: "GET",
		})
			.then((res) => res.json())
			.then((data) => {
				console.log("Received data:", data);
				setRegisteredUsers(data);
			})
			.catch((err) => console.error(err));
	}, []);

	return (
		<Box
			bgImage="url(/forest.jpg)"
			bgPosition="center"
			minH="100vh"
			display="flex"
			justifyContent="center"
		>
			<Card
				w={{ base: "500px" }}
				background="#f9f7e8"
				alignSelf="center"
				padding="20px"
				display="flex"
				flexDirection="column"
				justify="center"
				align="center"
			>
				<Text fontSize="2xl">REGISTERED USERS:</Text>
				{!registeredUsers && (
					<Text>There are no registered users.</Text>
        )}
				{registeredUsers && (
					<>
						{registeredUsers.map((user) => (
							<div key={user.id}>
								<Button
									variant="unstyled"
									_hover={{ color: "green" }}
									onClick={() => {
										onOpen();
										setFirstName(user.firstName);
										setLastName(user.lastName);
										setUsername(user.username);
										setEmail(user.email);
										setPassword(user.password);
									}}
									p="10px"
								>
									{user.firstName} {user.lastName}
								</Button>
								<Modal isOpen={isOpen} onClose={onClose}>
									<ModalOverlay />
									<ModalContent>
										<ModalHeader>USER INFO</ModalHeader>
										<ModalCloseButton />
										<ModalBody>
											<Input
												marginBottom="10px"
												defaultValue={firstName}
												onChange={changeFirstName}
												placeholder="First Name"
											/>
											<Input
												marginBottom="10px"
												defaultValue={lastName}
												onChange={changeLastName}
												placeholder="Last Name"
											/>
											<Input
												marginBottom="10px"
												defaultValue={username}
												onChange={changeUsername}
												placeholder="Username"
											/>
											<Input
												marginBottom="10px"
												defaultValue={email}
												onChange={changeEmail}
												placeholder="Email"
											/>
											<Input
												marginBottom="10px"
												defaultValue={password}
												onChange={changePassword}
												placeholder="Password"
											/>
										</ModalBody>
										<ModalFooter>
											<Button
												variant="ghost"
												onClick={onClose}
											>
												Close
											</Button>
											<Button
												colorScheme="green"
												onClick={() => {
													handleSubmit();
													onClose();
												}}
											>
												Confirm
											</Button>
										</ModalFooter>
									</ModalContent>
								</Modal>
							</div>
						))}
					</>
				)}
			</Card>
		</Box>
	);
}
