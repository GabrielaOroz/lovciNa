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
	Radio,
	RadioGroup,
	Stack,
	Text,
	useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

export default function ListOfUsers() {
	const [role, setRole] = useState("");
	const [requestedRole, setRequestedRole] = useState("");
	const [registeredUsers, setRegisteredUsers] = useState("");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [photoURL, setPhotoURL] = useState("");
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

	const convertByteArrayToUrl = (photo) => {
		const url = "data:image/jpeg;base64," + photo;
		setPhotoURL(url);
	};

	const handleSubmit = () => {
		const formData = new FormData();
		formData.append("allowedRole", role);
		formData.append("firstName", firstName);
		formData.append("lastName", lastName);
		formData.append("selectedFile", selectedFile);
		formData.append("email", email);
		formData.append("username", username);
		formData.append("password", password);
		for (const entry of formData.entries()) {
			console.log(entry[0] + ":", entry[1]);
		}

		fetch("http://localhost:8000/admin/newInfo", {
			method: "POST",
			body: formData,
		})
			.then((res) => {
				console.log(res);
				if (res.ok) {
					navigate("/admin-listOfUsers");
				}
			})
			.then((data) => console.log(data))
			.catch((err) => console.error(err));
	};
	const { isOpen, onOpen, onClose } = useDisclosure();

	const handleUsers = () => {
		fetch("http://localhost:8000/admin/registeredUsers", {
			method: "GET",
		})
			.then((res) => res.json())
			.then((data) => {
				console.log(data);
				setRegisteredUsers(data);
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
				<Button
					marginTop="8px"
					marginBottom="8px"
					colorScheme="green"
					onClick={() => handleUsers()}
				>
					Load all registered users.
				</Button>
				{!registeredUsers && <Text>There are no registered users.</Text>}
				{registeredUsers && (
					<>
						{registeredUsers.map((user) => (
							<div key={user.id}>
								<Button
									variant="unstyled"
									_hover={{ color: "green" }}
									onClick={() => {
										onOpen();
										setId(user.id);
										setFirstName(user.name);
										setLastName(user.surname);
										setUsername(user.username);
										setEmail(user.email);
										setPassword(user.password);
										setRequestedRole(user.role);
										convertByteArrayToUrl(user.photo);
									}}
									p="10px"
								>
									{user.name} {user.surname}
								</Button>
								<Modal isOpen={isOpen} onClose={onClose}>
									<ModalOverlay />
									<ModalContent>
										<ModalHeader>USER INFO</ModalHeader>
										<ModalCloseButton />
										<ModalBody>
											<Text textAlign="center" p="8px">Requested role: <b>{requestedRole}</b></Text>
											<Text textAlign="center" p="8px">Choose allowed role:</Text>
											<RadioGroup
												value={role}
												onChange={(newValue) => setRole(newValue)}
												alignSelf="center"
												color="gree700"
											>
												<Stack
													direction="column"
													spacing="20px"
													align="center"
													marginBottom="16px"
												>
													<Radio colorScheme="green" value="tracker">
														Tracker
													</Radio>
													<Radio colorScheme="yellow" value="researcher">
														Researcher
													</Radio>
													<Radio colorScheme="red" value="manager">
														Station Manager
													</Radio>
												</Stack>
											</RadioGroup>

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
												Upload new profile picture
											</Button>

											{!selectedFile && (
												<Image
													maxHeight="150px"
													src={photoURL}
													color="gree700"
												/>
											)}

											{selectedFile && (
												<Image
													maxHeight="150px"
													src={
														selectedFile && URL.createObjectURL(selectedFile)
													}
													color="gree700"
													alt={selectedFile ? selectedFile.name : ""}
												/>
											)}
										</ModalBody>
										<ModalFooter>
											<Button
												variant="ghost"
												onClick={() => {
													setSelectedFile("");
													onClose();
												}}
											>
												Cancel
											</Button>
											<Button
												colorScheme="green"
												onClick={() => {
													setSelectedFile("");
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
