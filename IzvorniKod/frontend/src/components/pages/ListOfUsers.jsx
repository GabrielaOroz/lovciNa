import {
	Box,
	Button,
	Card,
	Image,
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
import { useEffect, useRef, useState } from "react";

export default function ListOfUsers() {
	const [registeredUsers, setRegisteredUsers] = useState("");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [selectedFile, setSelectedFile] = useState("");

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

	const inputRef = useRef(null);
	const handleFileUpload = () => {
		inputRef.current.click();
	};
	const handleFileChange = (e) => {
		const file = e.target.files[0];
		if (!file) {
			return;
		}
		e.target.value = "";
		setSelectedFile(file);
	};

	const handleSubmit = () => {
		const newData = {
			firstName,
			lastName,
			username,
			email,
			password,
			selectedFile,
		};
		console.log(newData);

		fetch("http://localhost:8000/admin/newInfo", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(newData),
		})
			.then((res) => console.log(res))
			.then((data) => {
				console.log(data);
				navigate("/admin-listOfUsers");
			})
			.catch((err) => console.error(err));
	};

	
	
	const { isOpen, onOpen, onClose } = useDisclosure();

	useEffect(() => {
		fetch("http://localhost:8000/admin/registeredUsers", {
			method: "GET",
		})
			.then((res) => console.log(res))
			.then((data) => {
				console.log(data);
				setRegisteredUsers(JSON.parse(data));
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
										setSelectedFile(user.selectedFile);
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

											<Input
												style={{ display: "none" }}
												type="file"
												ref={inputRef}
												onChange={handleFileChange}
												id="file"
											/>
											<Button
												marginBottom="10px"
												onClick={handleFileUpload}
												bgColor="#F1EDD4"
												_hover={{ bg: "gree700" }}
												border="0"
											>
												Upload profile picture
											</Button>
											<Image
												src={
													selectedFile &&
													URL.createObjectURL(
														selectedFile
													)
												}
												color="gree700"
												alt={
													selectedFile
														? selectedFile.name
														: ""
												}
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
