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
  const [id, setId] = useState("");
	const [requestedRole, setRequestedRole] = useState("");
	const [registeredUsers, setRegisteredUsers] = useState("");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [photoURL, setPhotoURL] = useState("");
	const [selectedFile, setSelectedFile] = useState("");

	const [rightEmail, setRightEmail] = useState(true);
	const [rightFirstName, setRightFirstName] = useState(true);
	const [rightLastName, setRightLastName] = useState(true);
	const [rightPicture, setRightPicture] = useState(true);
	const [rightPass, setRightPass] = useState(true);
	const [rightUsername, setRightUsername] = useState(true);

	const validateEmail = () => {
		const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/i; //sensitive case email??
		if (emailRegex.test(email)) {
			setRightEmail(true);
			return true;
		} else {
			setRightEmail(false);
			return false;
		}
	};
	const validateFirstName = () => {
		const nameRegex = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u //^[a-z ,.'-]+$/i;
		if (nameRegex.test(firstName)) {
			setRightFirstName(true);
			return true;
		} else {
			setRightFirstName(false);
			return false;
		}
	};
	const validateLastName = () => {
		const nameRegex = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u //^[a-z ,.'-]+$/i;
		if (nameRegex.test(lastName)) {
			setRightLastName(true);
			return true;
		} else {
			setRightLastName(false);
			return false;
		}
	};
	const validatePass = () => {
		const passRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,16}$/;
		if (passRegex.test(password)) {
			setRightPass(true);
			return true;
		} else {
			setRightPass(false);
			return false;
		}
	};
	const validateUsername = () => {
		const usernameRegex = /^\w+$/;
		if (usernameRegex.test(username)) {
			setRightUsername(true);
			return true;
		} else {
			setRightUsername(false);
			return false;
		}
	};

	const validatePicture = () => {
		if (selectedFile == null) {
			setRightPicture(false);
			return false;
		} else {
			setRightPicture(true);
			return true;
		}
	};

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
			formData.append("id", id);
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

		}
 
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
								<Modal scrollBehavior="inside" blockScrollOnMount={false} closeOnOverlayClick={false} isOpen={isOpen} onClose={() => {
                  setSelectedFile("");
                  onClose()
                }}>
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
											<Text
												style={{ display: rightEmail ? "none" : "block" }}
												fontSize="sm"
												fontWeight="bold"
												color="#CC0000"
											>
												Invalid email format
											</Text>
											<Input
												marginBottom="10px"
												defaultValue={password}
												onChange={changePassword}
												placeholder="Password"
											/>
											<Text
												style={{ display: rightPass ? "none" : "block" }}
												fontSize="sm"
												fontWeight="bold"
												color="#CC0000"
											>
												Password must be between 8 and 16 characters and include
												letters(A-Z), numbers(0-9) and special characters(!,@,#,$,%,^,&,*)
											</Text>

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
													maxHeight="300px"
													src={photoURL}
													color="gree700"
												/>
											)}

											{selectedFile && (
												<Image
													maxHeight="300px"
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
													validateFirstName();
													validateLastName();
													validateEmail();
													validateUsername();
													validatePicture();
													validatePass();
													if(validateFirstName() && validateLastName() && validateEmail() && validateUsername() && 
													validatePicture() && validatePass()) {
														setSelectedFile("");
														handleSubmit();
														onClose();
													}
													
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
