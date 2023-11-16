import {
	Button,
	Flex,
	Input,
	InputGroup,
	InputRightElement,
	Radio,
	RadioGroup,
	Show,
	Stack,
	Text,
} from "@chakra-ui/react";
import Base from "../Base";
import FormCard from "../FormCard";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GiBearFace } from "react-icons/gi";

export default function Register() {
	const [role, setRole] = useState("tracker");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [selectedFile, setSelectedFile] = useState(null);
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const [showPass, setShowPass] = useState(false);

	const [rightEmail, setRightEmail] = useState(true);
	const [rightFirstName, setRightFirstName] = useState(true);
	const [rightLastName, setRightLastName] = useState(true);
	const [rightPicture, setRightPicture] = useState(true);
	const [rightPass, setRightPass] = useState(true);
	const [rightUsername, setRightUsername] = useState(true);

	const [error, setError] = useState("");

	const navigate = useNavigate();

	const validateEmail = () => {
		const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/i;
		if (emailRegex.test(email)) {
			setRightEmail(true);
			return true;
		} else {
			setRightEmail(false);
			return false;
		}
	};
	const validateFirstName = () => {
		const nameRegex =
			/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u;
		if (nameRegex.test(firstName)) {
			setRightFirstName(true);
			return true;
		} else {
			setRightFirstName(false);
			return false;
		}
	};
	const validateLastName = () => {
		const nameRegex =
			/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u;
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
		setError("");
		validateFirstName();
		validateLastName();
		validateEmail();
		validateUsername();
		validatePicture();
		validatePass();

		if (
			validateFirstName() &&
			validateLastName() &&
			validateEmail() &&
			validatePass() &&
			validateUsername() &&
			validatePicture()
		) {
			const formData = new FormData();
			formData.append("role", role);
			formData.append("firstName", firstName);
			formData.append("lastName", lastName);
			formData.append("selectedFile", selectedFile);
			formData.append("email", email);
			formData.append("username", username);
			formData.append("password", password);
			for (const entry of formData.entries()) {
				console.log(entry[0] + ":", entry[1]);
			}

			fetch("https://wildtrack.onrender.com/auth/register", {
				method: "POST",
				body: formData,
			})
				.then((res) => {
					console.log(res);
					if (res.ok) {
						navigate("/confirm");
					} else {
						setError("User already exists.");
					}
				})
				.then((data) => console.log(data))
				.catch((err) => console.error(err));
		}
	};

	return (
		<Base>
			<FormCard>
				<Flex justifyContent="space-around" alignItems="center">
					<Show above="md">
						<GiBearFace size="30px" color="green.700" />
					</Show>
					<Text fontSize="lg" color="#green.700">
						CREATE YOUR ACCOUNT
					</Text>
					<Show above="md">
						<GiBearFace size="30px" color="green.700" />
					</Show>
				</Flex>

				<RadioGroup value={role} onChange={(newValue) => setRole(newValue)} alignSelf="center" color="gree700">
					<Stack direction={["column", "column", "column", "row"]} spacing="20px" align="center">
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
					type="text"
					placeholder="First name"
					focusBorderColor={rightFirstName ? "" : "#AA0000"}
					borderColor={rightFirstName ? "" : "#FF0000"}
					value={firstName}
					onChange={(e) => setFirstName(e.target.value)}
					id="firstName"
				/>
				<Input
					type="text"
					placeholder="Last name"
					focusBorderColor={rightFirstName ? "" : "#AA0000"}
					borderColor={rightLastName ? "" : "#FF0000"}
					value={lastName}
					onChange={(e) => setLastName(e.target.value)}
					id="lastName"
				/>

				<Input style={{ display: "none" }} type="file" ref={inputRef} onChange={handleFileChange} id="file" />
				<Button marginTop="15px" onClick={handleFileUpload} bgColor="#F1EDD4" border="0">
					Upload profile picture
				</Button>
				<img src={selectedFile && URL.createObjectURL(selectedFile)} alt={selectedFile ? selectedFile.name : ""} />
				{selectedFile && (
					<Button w="200px" alignSelf="center" bgColor="#F1EDD4" onClick={() => setSelectedFile("")}>
						Remove picture
					</Button>
				)}
				<Text style={{ display: rightPicture ? "none" : "block" }} fontSize="sm" fontWeight="bold" color="#CC0000">
					Please, upload your profile picture
				</Text>

				<Input
					type="email"
					placeholder="Email adress"
					focusBorderColor={rightEmail ? "" : "#AA0000"}
					borderColor={rightEmail ? "" : "#FF0000"}
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					id="email"
				/>
				<Text style={{ display: rightEmail ? "none" : "block" }} fontSize="sm" fontWeight="bold" color="#CC0000">
					Invalid email format
				</Text>
				<Input
					type="text"
					placeholder="Username"
					focusBorderColor={rightUsername ? "" : "#AA0000"}
					borderColor={rightUsername ? "" : "#FF0000"}
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					id="username"
				/>
				<InputGroup size="md">
					<Input
						type={showPass ? "text" : "password"}
						placeholder="Enter password"
						focusBorderColor={rightPass ? "" : "#AA0000"}
						borderColor={rightPass ? "" : "#FF0000"}
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

				<Text style={{ display: rightPass ? "none" : "block" }} fontSize="sm" fontWeight="bold" color="#CC0000">
					Password must be between 8 and 16 characters and include letters(A-Z), numbers(0-9) and special
					characters(!,@,#,$,%,^,&,*)
				</Text>

				<Button
					type="submit"
					colorScheme="green"
					border="solid 1px"
					color="#FFFBE0"
					w="100px"
					alignSelf="center"
					onClick={handleSubmit}
				>
					Submit
				</Button>

				<Text alignSelf="center" color="#CC0000">
					{error}
				</Text>

				<Text alignSelf="center" color="black">
					Already have an account?
					<Link to="/login">
						<Button paddingLeft="5px" variant="unstyled" color="green.700">
							Log In
						</Button>
					</Link>
				</Text>
			</FormCard>
		</Base>
	);
}
